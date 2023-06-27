const mongoose = require('mongoose');

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

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have name'],
    },
    password: {
      type: String,
      required: [true, 'A user must have password'],
      minlength: [6, 'A user password must have more than 6 characters'],
      select: false,
    },
    email: {
      type: String,
      required: [true, 'A user must have email'],
      unique: true,
      lowerCase: true,
    },
    phonenumber: {
      type: Number,
      required: [true, 'A user must have phone number'],
      unique: true,
      minlength: [10, 'A user phone number invalid'],
      maxlength: [10, 'A user phone number invalid'],
    },
    geometry: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        default: [72.595337, 23.114181],
      },
      area: {
        type: String,
        default: 'Maninagar',
      },
      place_name: {
        type: String,
        default: 'Ahmedabad, Gujarat',
      },
      required: false,
    },
    addressList: {
      type: [address],
    },
    img_url: {
      type: String,
      default: '',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual populate for user orders
usersSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id',
});

//Virtual populate for user reviews
usersSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

const Users = mongoose.model('User', usersSchema);

module.exports = Users;
