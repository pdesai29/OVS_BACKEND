const express = require('express');
const reviewsControllers = require('../controllers/reviewsControllers');
const reviewsRouter = express.Router();
reviewsRouter.route('/').post(reviewsControllers.createReview);
reviewsRouter.route('/:reviewId').get(reviewsControllers.getReview);
module.exports = reviewsRouter;
