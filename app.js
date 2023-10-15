//modules require
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Set Security for HTTP headers
//Important for setting of CSP error
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': [
        "'self'",
        'https://cdnjs.cloudflare.com',
        'https://api.mapbox.com',
        'https://*.mapbox.com',
        'https://js.stripe.com/v3/',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
        'https://events.mapbox.com',
        'blob:',
      ],
      'frame-src': [
        "'self'",
        'https://cdnjs.cloudflare.com',
        'https://api.mapbox.com',
        'https://*.mapbox.com',
        'https://js.stripe.com/v3/',
      ],
      'connect-src': [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'ws://localhost:49263/',
      ],
    },
  }),
);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
// A Global Middleware
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// dotenv.config({ path: `${__dirname}/config.env` });
console.log(process.env.NODE_ENV);
// console.log(process.env);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests form the same API
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, Please try again later.',
});
app.use('/api', limiter);

//Body parser, reading date form body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data Sanitization against NoSql query
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//HTTP Parameter Population
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingAverage',
      'ratingsQuantity',
    ],
  }),
);

//This is for test
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//separate application to sub app
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Handle all not found routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
