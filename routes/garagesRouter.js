const { Router } = require('express');
const express = require('express');
const garagesControllers = require('../controllers/garagesControllers');
const garagesRouter = express.Router();
const authControllers = require('../controllers/authControllers');
// For geospatial location's
garagesRouter
  .route(
    '/garages-within/:distance/center/:latlng/unit/:unit/subCategory/:subCat'
  )
  .get(garagesControllers.getGaragesWithin);
// /garages-within?distance=233&center=-40,45&unit=mi
// /garages-within/233/center/-40,45/unit/mi
garagesRouter.route('/').get(garagesControllers.getAllGarages);
garagesRouter.route('/verifyGarage').post(authControllers.verifyGarage);
garagesRouter.route('/addGarage').post(authControllers.addGarage);
garagesRouter.route('/loginVerify').post(authControllers.garageLoginVerify);
garagesRouter.route('/login').post(authControllers.garageLogin);
garagesRouter.route('/addService').post(garagesControllers.addService);

garagesRouter
  .route('/:id')
  .get(garagesControllers.getGarage)
  .patch(garagesControllers.updateGarage);

module.exports = garagesRouter;
