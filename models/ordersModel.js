const mongoose = require('mongoose');
const service = new mongoose.Schema({
  category: {
    type: String,
    enum: {
      values: ['Four Wheeler', 'Three Wheeler', 'Two Wheeler'],
      message: 'categories is either: Four Wheeler Three Wheeler Two Wheeler',
    },
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
    minlength: [1, 'A price should be greater than zero'],
  },
  description: {
    type: String,
  },
  img_url: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});
const address = mongoose.Schema({
  flat_no: {
    type: String,
    required: [true, 'A address must have flat_no'],
  },
  landmark: {
    type: String,
    required: [true, 'A address must have landmark'],
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  place_name: {
    type: String,
    required: true,
  },
});
const orderSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A order must belong to a user'],
    },
    garage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Garage',
      required: [true, 'A order must belong to a garage'],
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'rejected', 'completed', 'reviewed'],
        message:
          'A order status must belong to these field  pending , processing , rejected , completed, reviewed .',
      },
      required: true,
    },
    isPaymentDone: {
      type: Boolean,
    },
    serviceList: {
      type: [service],
      required: [true, 'A order must not be empty'],
    },
    userAddress: {
      type: address,
      required: [true, 'A order must contain user address'],
    },
    review: {
      rating: {
        type: Number,
      },
      reviewMessage: {
        type: String,
        default: '',
      },
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Populating some details of user and garage
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name phonenumber email',
  }).populate({
    path: 'garage',
    select: 'name phonenumber email img_url',
  });
  next();
});

const Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;
