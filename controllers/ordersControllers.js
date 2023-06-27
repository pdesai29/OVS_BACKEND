const Orders = require('../models/ordersModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/usersModels');
const Garages = require('../models/garagesModels');
const { request } = require('express');

exports.createOrder = catchAsync(async (request, response, next) => {
  const { user_id, garage_id, userAddress, serviceList, orderStatus } =
    request.body;
  if (
    !(
      user_id &&
      garage_id &&
      userAddress &&
      serviceList &&
      orderStatus === 'pending'
    )
  )
    return next(new AppError('Missing fields and data', 404));
  //   console.log({ user_id, garage_id, userAddress, serviceList });
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

  const order = await Orders.create({
    user: user_id,
    garage: garage_id,
    userAddress,
    serviceList,
    orderStatus,
  });
  if (!order)
    return next(
      new AppError('Sorry for inconvinence we cannot create this order'),
      404
    );

  response.status(200).json({
    status: 'success',
    message: 'Order created successfully!',
    data: order,
  });
});

exports.updateOrder = catchAsync(async (request, response, next) => {
  const queryObj = { ...request.body };
  const illegalFieldsToUpdate = ['user_id', 'garage_id', 'userAddress'];
  illegalFieldsToUpdate.forEach((field) => delete queryObj[field]);

  const updatedOrder = await Orders.findByIdAndUpdate(
    request.params.orderId,
    queryObj,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedOrder) return next(new AppError('No order with this id'));
  response.status(200).json({
    status: 'success',
    message: 'Changes in Order Updated successfully',
    data: updatedOrder,
  });
});

exports.getOrder = catchAsync(async (request, response, next) => {
  const order = await Orders.findById(request.params.orderId);
  if (!order)
    return next(
      new AppError(`No order with this ${request.params.orderId} exist`, 404)
    );

  response.status(200).json({
    status: 'success',
    data: order,
  });
});
