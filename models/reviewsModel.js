const mongoose = require('mongoose');
const Garages = require('./garagesModels');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A rating to garage must be required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    garage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Garage',
      required: [true, 'Review must belong to a garage.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Populating some details of user and garage
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name img_url',
  }).populate({
    path: 'garage',
    select: 'name img_url',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (garageId) {
  const stat = await this.aggregate([
    {
      $match: { garage: garageId },
    },
    {
      $group: {
        _id: '$garage',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stat);

  await Garages.findByIdAndUpdate(garageId, {
    ratingsQuantity: stat[0].nRatings,
    ratingsAverage: Number(stat[0].avgRating.toFixed(1)),
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.garage);
});

const Reviews = mongoose.model('Review', reviewSchema);
module.exports = Reviews;
