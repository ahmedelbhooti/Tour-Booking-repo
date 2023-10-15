/* eslint-disable*/
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const User = require('./../models/userModel');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const jwt = require('jsonwebtoken');
const { request } = require('http');
const { response } = require('express');

//------Upload photo section--------------
const multerStorage = multer.memoryStorage();

// Check if the file is jpeg or jpg or png etc
const multerFilter = (req, file, cd) => {
  if (file.mimetype.startsWith('image')) {
    cd(null, true);
  } else {
    cd(new AppError('No an image! Please upload only images.', 400), false);
  }
};
//Collect everything here to through it to uploadUserPhoto middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
//resize the photo to be square
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
//---------End of uploadUserPhoto middleware

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
    // photo: req.file.filename,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url, 1).sendWelcome();
  createSendToken(newUser, 201, res);
});

// ---------------------login checker function-------------------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password are existing
  if (!email || !password) {
    // 400 is a bad request
    return next(new AppError('Please provide email and password!', 400));
  }

  //Check email and password is correct
  const user = await User.findOne({ email }).select('+password');
  // console.log(req.body.email);

  if (!user || !(await user.correctPassword(password, user.password))) {
    // 401 is a unauthorized
    return next(new AppError('Incorrect email or password!', 401));
  }

  //If everything is correct send token to the client
  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
});

//-------------------middleware for authorization------------------------
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  //Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  // console.log(decoded);

  //Check if user is Exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  //Check if password is changed or not
  const isPasswordChanged = await freshUser.passwordChangedAfter(decoded.iat);
  if (isPasswordChanged) {
    return next(
      new AppError('User recently changed password! please log in again.', 401),
    );
  }

  //Grant access to protected route
  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

//----------Only for rendering pages, no errors------------
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY,
      );
      // console.log(decoded);

      //Check if user is Exist
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      const isPasswordChanged = await freshUser.passwordChangedAfter(
        decoded.iat,
      );
      if (isPasswordChanged) {
        return next();
      }

      //This mean user is logged in
      res.locals.user = freshUser;
      // console.log(res.locals.user);
      return next();
    } catch (e) {
      return next();
    }
  }
  next();
};

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //Mean if the roles include admin or lead-guide it will be true if not it will be false.
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403),
      );
    }
    next();
  };
};

//-----------Forget Password function--------------
exports.forgetPassword = catchAsync(async (req, res, next) => {
  //Get user based on POSTed Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address!'), 404);
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Sending Email
  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken} `;

    await new Email(user, resetUrl, resetToken).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email.',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(e);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

//----------------Reset Password Function----------------------
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) If token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) set passwordChangedAt
  //4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

//-----------------Update current password----------------------------
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2) check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your current password is wrong!', 401));

  //If so update password
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save();

  //4) Log the user in, send JWT
  createSendToken(user, 200, res);
});
