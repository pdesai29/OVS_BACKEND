const mongoose = require('mongoose');

const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
});

const service = new mongoose.Schema({
  category: {
    type: String,
    enum: {
      values: ['Four Wheeler', 'Three Wheeler', 'Two Wheeler'],
      message: 'categories is either: Four Wheeler Three Wheeler Two Wheeler',
    },
    required: [true, 'A service must have a category'],
  },
  name: {
    type: String,
    required: [true, 'A service must have a name'],
    unique: [true, 'Duplicate service found with same naem'],
  },
  price: {
    type: Number,
    minlength: [1, 'A price should be greater than zero'],
    required: [true, 'A service must have a price'],
  },
  description: {
    type: String,
  },
  img_url: {
    type: String,
  },
});

const garagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A garage must have a name'],
      maxlength: [
        40,
        'A garage name must have less or equal then 40 characters',
      ],
      minlength: [
        5,
        'A garage name must have more or equal then 10 characters',
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'A garage must have password'],
      minlength: [6, 'A garage password must have more than 6 characters'],
      select: false,
    },
    categories: {
      type: [String],
      enum: {
        values: ['Four Wheeler', 'Three Wheeler', 'Two Wheeler'],
        message: 'categories is either: Four Wheeler Three Wheeler Two Wheeler',
      },
    },
    phonenumber: {
      type: Number,
      required: [true, 'A garage must have phone number'],
      unique: true,
      minlength: [10, 'A garage phone number must have 1 digit'],
      maxlength: [10, 'A garage phone number must have 1 digit'],
    },
    email: {
      type: String,
      required: [true, 'A garage must have email'],
      unique: true,
      lowerCase: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    img_url: {
      type: String,
      default:
        'https://c1.wallpaperflare.com/preview/379/459/604/garage-underground-store-closed.jpg',
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
        required: [true, 'A garage must have lat and long'],
      },
      area: {
        type: String,
      },
      place_name: {
        type: String,
      },
      required: false,
    },
    address: {
      type: String,
    },
    service: {
      type: [service],
      required: false,
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual populate for garage orders
garagesSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'garage',
  localField: '_id',
});

//Garages index
garagesSchema.index({ geometry: '2dsphere' });

const Garages = mongoose.model('Garage', garagesSchema);

module.exports = Garages;
