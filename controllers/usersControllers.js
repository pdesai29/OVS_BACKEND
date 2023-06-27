const Users = require('../models/usersModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/API_Features');
const axios = require('axios');
exports.getUser = async (request, response) => {
  try {
    const user = await Users.findById(request.params.id)
      .populate({
        path: 'orders',
        options: {
          sort: '-createdAt',
        },
      })
      .populate('reviews');
    if (!user)
      return next(new AppError('User with this id does not exist', 404));
    response.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    response.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateUser = catchAsync(async (request, response, next) => {
  const queryObj = { ...request.body };
  const illegalFieldsToUpdate = ['email', 'phonenumber'];
  illegalFieldsToUpdate.forEach((field) => delete queryObj[field]);

  const updatedUser = await Users.findByIdAndUpdate(
    request.params.id,
    queryObj,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) return next(new AppError('No user with this id'));
  response.status(200).json({
    status: 'success',
    message: 'Changes Updated successfully',
    data: updatedUser,
  });
});

exports.getAllUser = catchAsync(async (request, response, next) => {
  const features = new APIFeatures(Users.find(), request.query);
  features.filter().sort().limitFields().paginate();
  const users = await features.query;

  response.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.getUserAddress = catchAsync(async (request, response, next) => {
  let { latitude, longitude } = request.params;
  // let API_URL = `https://apis.mapmyindia.com/advancedmaps/v1/abmmijbxyarfzoxzgjvs2q4fkxsny9vk/rev_geocode?lat=${latitude}&lng=${longitude}`;
  // let result = await axios.get(API_URL);
  // if (!result) return next(new AppError('Can get to api map my india'));
  // let { locality, formatted_address } = result.data.results[0];
  // if (locality && formatted_address) {
  //   latitude = parseFloat(parseFloat(latitude).toFixed(6));
  //   longitude = parseFloat(parseFloat(longitude).toFixed(6));
  response.status(200).json({
    status: 'success',
    data: {
      lat: 23.114181,
      long: 72.595337,
      area: 'Sola',
      place: 'Sola, Ahmedabad',
    },
  });
  // }
});

exports.addUserAddress = catchAsync(async (request, response, next) => {
  let { user_id, flat_no, landmark, lat, long, place_name } = request.body;
  if (user_id && flat_no && landmark && lat && long && place_name) {
    if (!(!lat || !long || isNaN(lat) || isNaN(long))) {
      lat = parseFloat(parseFloat(lat).toFixed(6));
      long = parseFloat(parseFloat(long).toFixed(6));
      const userUpdatedAddress = await Users.findByIdAndUpdate(
        user_id,
        {
          $addToSet: {
            addressList: {
              flat_no,
              landmark,
              lat,
              long,
              place_name,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!userUpdatedAddress)
        return next(new AppError('User with this id does not exist', 404));

      response.status(200).json({
        status: 'success',
        message: 'new user address added',
        data: userUpdatedAddress,
      });
    } else {
      return next(new AppError('Illegal coordinates !!', 404));
    }
  } else {
    return next(new AppError('Missing some fields or data !', 404));
  }
});

exports.deleteUserAddress = catchAsync(async (request, response, next) => {
  const { user_id, address_id } = request.body;
  if (user_id && address_id) {
    const userDeletedAddress = Users.findByIdAndUpdate(user_id, {
      $pull: { addressList: { _id: address_id } },
    });
    if (!userDeletedAddress)
      return next(new AppError('User with this id does not exist', 404));
    response.status(200).json({
      status: 'success',
      message: 'Address deleted',
    });
  } else {
    return next(new AppError('Missing field and data', 404));
  }
});
