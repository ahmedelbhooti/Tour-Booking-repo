const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');

exports.getOverview = catchAsync(async (req, res) => {
  //1) get all tours
  const tours = await Tour.find();

  //2) build our template
  //3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get all tour details
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res
    .status(200)
    //This set to solve the CSP (Content-Security-Policy) error
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    // )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.loginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
});

exports.signupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signUp', {
    title: 'Sign Up',
  });
});

exports.forgetPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render('forgetpassword', {
    title: 'Forget Password',
  });
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  res.status(200).render('resetpassword', {
    title: 'Reset Password',
    token,
  });
  console.log(token);
});

exports.getAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
