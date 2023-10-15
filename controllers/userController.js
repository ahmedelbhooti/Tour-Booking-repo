const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

//-----This for where will photo storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cd) => {
//     cd(null, 'public/img/users');
//   },
//   filename: (req, file, cd) => {
//     const ext = file.mimetype.split('/')[1];
//     cd(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

//Check if the file is jpeg or jpg or png etc
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

//The middleware to upload user photo
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//this middleware to set params id to the current user id to get the current user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  //1)check if user POSTed password
  if (req.body.password || req.body.passwordConfirmation)
    return next(
      new AppError(
        'This route is not for password update. Please user /updateMyPassword',
        400,
      ),
    );

  //2) Unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  //check if there is a file in the request to upload this file (photo)
  if (req.file) filteredBody.photo = req.file.filename;
  //3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Don't update the password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
