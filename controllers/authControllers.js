const Users = require('../models/usersModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const {
  loginValidation,
  registrationValidation,
} = require('../utils/validation');
const Garages = require('../models/garagesModels');
const UserOTP = 9000;
const GarageOTP = 9999;

exports.addUser = catchAsync(async (request, response, next) => {
  if (UserOTP === request.body.otp) {
    const { phonenumber, email, name, password } = request.body;

    //Validating obj
    const { error } = registrationValidation({
      phonenumber,
      email,
      name,
      password,
    });
    // console.log(error);
    if (error) return next(new AppError('Validation Failed!', 404));

    const oldUser = await Users.find({
      $or: [
        { phonenumber: parseInt(phonenumber) },
        { email: email.toLowerCase() },
      ],
    });
    if (oldUser.length > 0)
      return next(new AppError('User already exits', 404));
    let newUser = await Users.create({
      name: name,
      password: password,
      phonenumber: parseInt(phonenumber),
      email: email.toLowerCase(),
    });

    //TOKEN CREATION

    response.status(200).json({
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    });
  } else {
    return next(new AppError('Invalid OTP!', 404));
  }
});

exports.verifyUser = catchAsync(async (request, response, next) => {
  const { error } = registrationValidation({ ...request.body });
  if (error)
    return next(
      new AppError(
        'Validation Failed! \n1) Check if phone number is correct \n2) Check if email id is correct \n3) Name must be grater than 2 characters \n4) Password must be greater than 6 characters',
        404
      )
    );
  const { phonenumber, email } = request.body;

  const oldUser = await Users.find({
    $or: [
      { phonenumber: parseInt(phonenumber) },
      { email: email.toLowerCase() },
    ],
  });
  if (oldUser.length > 0) {
    return next(new AppError('User already exits', 404));
  }
  response.status(200).json({
    status: 'success',
    message: 'OTP send successfully',
  });
});

exports.login = catchAsync(async (request, response, next) => {
  if (UserOTP === request.body.otp) {
    const { phonenumber } = request.body;
    const { error } = loginValidation({ phonenumber });
    if (error)
      return next(new AppError('Phone Number Validation error ' + error, 404));
    const user = await Users.find({
      phonenumber: phonenumber,
    });
    if (user.length <= 0)
      return next(new AppError('User does not exist! Need to Register', 404));
    response.status(200).json({
      status: 'success',
      data: user[0],
    });
  } else {
    return next(new AppError('Invalid OTP!', 404));
  }
});
exports.loginVerify = catchAsync(async (request, response, next) => {
  const { phonenumber } = request.body;
  const { error } = loginValidation({ phonenumber });
  if (error)
    return next(new AppError('Phone Number Validation error ' + error, 404));
  const user = await Users.find({
    phonenumber: phonenumber,
  });
  if (user.length <= 0)
    return next(new AppError('User does not exist! Need to Sign Up', 404));
  response.status(200).json({
    status: 'success',
    message: 'OTP send successfully',
  });
});

exports.verifyGarage = catchAsync(async (request, response, next) => {
  let { name, password, email, phonenumber, location, address } = request.body;

  const { error } = registrationValidation({
    name,
    password,
    email,
    phonenumber,
  });
  if (error) return next(new AppError(`Validation error: ${error}`, 400));

  if (!location)
    return next(new AppError('A garage must have its location', 404));
  let { lat, long, area, place_name } = location;

  if (!(!lat || !long || isNaN(lat) || isNaN(long))) {
    lat = parseFloat(parseFloat(lat).toFixed(6));
    long = parseFloat(parseFloat(long).toFixed(6));
  } else {
    return next(new AppError('Illegal coordinates !!', 404));
  }

  if (!address) return next(new AppError('A garage must have an address', 404));

  phonenumber = parseInt(phonenumber);
  email = email.toLowerCase();

  const oldGarage = await Garages.find({
    $or: [{ phonenumber: phonenumber }, { email: email }],
  });
  if (oldGarage.length > 0)
    return next(new AppError('User already exits', 404));
  response.status(200).json({
    status: 'success',
    message: 'OTP send successfully',
  });
});

exports.addGarage = catchAsync(async (request, response, next) => {
  if (GarageOTP === request.body.otp) {
    let { name, password, email, phonenumber, location, address } =
      request.body;
    const { error } = registrationValidation({
      name,
      password,
      email,
      phonenumber,
    });
    if (error) return next(new AppError(`Validation error: ${error}`, 400));

    if (!location)
      return next(new AppError('A garage must have its location', 404));
    let { lat, long, area, place_name } = location;

    if (!(!lat || !long || isNaN(lat) || isNaN(long))) {
      lat = parseFloat(parseFloat(lat).toFixed(6));
      long = parseFloat(parseFloat(long).toFixed(6));
    } else {
      return next(new AppError('Illegal coordinates !!', 404));
    }

    if (!address)
      return next(new AppError('A garage must have an address', 404));

    phonenumber = parseInt(phonenumber);
    email = email.toLowerCase();

    const oldGarage = await Garages.find({
      $or: [{ phonenumber: phonenumber }, { email: email }],
    });
    if (oldGarage.length > 0)
      return next(new AppError('User already exits', 404));

    const newGarage = await Garages.create({
      name,
      password,
      email,
      phonenumber,
      geometry: {
        coordinates: [long, lat],
        area,
        place_name,
      },
      address,
    });
    response.status(200).json({
      status: 'success',
      message: 'Garage created successfully',
      data: newGarage,
    });
  } else {
    return next(new AppError('Invalid OTP!', 404));
  }
});

exports.garageLoginVerify = catchAsync(async (request, response, next) => {
  const { phonenumber } = request.body;
  const { error } = loginValidation({ phonenumber });
  if (error)
    return next(new AppError('Phone Number Validation error ' + error, 404));
  const garage = await Garages.find({
    phonenumber: phonenumber,
  });
  if (garage.length <= 0)
    return next(new AppError('Garage does not exist! Need to Sign Up', 404));
  response.status(200).json({
    status: 'success',
    message: 'OTP send successfully',
  });
});

exports.garageLogin = catchAsync(async (request, response, next) => {
  if (GarageOTP === request.body.otp) {
    const { phonenumber } = request.body;
    const { error } = loginValidation({ phonenumber });
    if (error)
      return next(new AppError('Phone Number Validation error ' + error, 404));
    const garage = await Garages.find({
      phonenumber: phonenumber,
    }).populate('orders');
    if (garage.length <= 0)
      return next(new AppError('Garage does not exist! Need to Register', 404));
    response.status(200).json({
      status: 'success',
      data: garage[0],
    });
  } else {
    return next(new AppError('Invalid OTP!', 404));
  }
});
