const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const authControllers = require('../controllers/authControllers');
const ordersControllers = require('../controllers/ordersControllers');

const usersRouter = express.Router();
usersRouter.route('/').get(usersControllers.getAllUser);
usersRouter.route('/addUser').post(authControllers.addUser);
usersRouter.route('/verifyUser').post(authControllers.verifyUser);
usersRouter
  .route('/getAddress/:latitude/:longitude')
  .get(usersControllers.getUserAddress);
usersRouter.route('/loginVerify').post(authControllers.loginVerify);
usersRouter.route('/login').post(authControllers.login);
usersRouter
  .route('/userAddress')
  .patch(usersControllers.addUserAddress)
  .delete(usersControllers.deleteUserAddress);
usersRouter
  .route('/:id')
  .get(usersControllers.getUser)
  .patch(usersControllers.updateUser);
module.exports = usersRouter;
