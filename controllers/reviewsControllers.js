const Reviews = require('../models/reviewsModel');
const Users = require('../models/usersModels');
const Garages = require('../models/garagesModels');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (request, response, next) => {
  const { review, rating, garage_id, user_id } = request.body;
  if (!(review && rating && garage_id && user_id))
    return next(new AppError('Missing fields and data', 404));
  //   Check if user is exits or not
  const user = await Users.findById({
    _id: user_id,
  });
  if (!user) return next(new AppError('No user with this id', 404));
  //   Check if garage is exist or not
  const garage = await Garages.findById({
    _id: garage_id,
  });
  if (!garage) return next(new AppError('No garage with this id', 404));
  const newReview = await Reviews.create({
    user: user_id,
    garage: garage_id,
    rating,
    review,
  });
  if (!newReview)
    return next(
      new AppError('Sorry for inconvinence we cannot create this review'),
      404
    );
  response.status(200).json({
    status: 'success',
    message: 'Review created successfully!',
    data: newReview,
  });
});

exports.getReview = catchAsync(async (request, response, next) => {
  const review = await Reviews.findById(request.params.reviewId);
  if (!review)
    return next(
      new AppError(`No review with this ${request.params.reviewId} exist`, 404)
    );

  response.status(200).json({
    status: 'success',
    data: review,
  });
});
