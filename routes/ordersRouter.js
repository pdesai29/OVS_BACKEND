const express = require('express');
const ordersControllers = require('../controllers/ordersControllers');

const ordersRouter = express.Router();
ordersRouter.route('/').post(ordersControllers.createOrder);
ordersRouter
  .route('/:orderId')
  .get(ordersControllers.getOrder)
  .patch(ordersControllers.updateOrder);
module.exports = ordersRouter;
