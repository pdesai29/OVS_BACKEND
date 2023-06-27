const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const garagesRouter = require('./routes/garagesRouter');
const usersRouter = require('./routes/usersRouter');
const ordersRouter = require('./routes/ordersRouter');
const reviewRouter = require('./routes/reviewsRouter');

// MIDDLE_WARE
app.use(cors({ origin: '*' }));
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
}
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/garages', garagesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
