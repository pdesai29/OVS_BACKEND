const Garages = require('../models/garagesModels');
const APIFeatures = require('../utils/API_Features');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllGarages = catchAsync(async (request, response, next) => {
  const features = new APIFeatures(Garages.find(), request.query);
  features.filter().sort().limitFields().paginate();
  const garages = await features.query;
  if (!garages) return next('Sorry no garges in result', 404);
  response.status(200).json({
    status: 'success',
    results: garages.length,
    garages,
  });
});

exports.getGarage = catchAsync(async (request, response, next) => {
  const garage = await Garages.findById(request.params.id).populate({
    path: 'orders',
    options: {
      sort: '-createdAt',
    },
  });
  if (!garage)
    return next(new AppError('Garage with this id does not exist', 404));
  response.status(200).json({
    status: 'success',
    data: garage,
  });
});

exports.aliasGarages = async (request, response, next) => {
  const subUrl = { ...request };
  if (subUrl.url.includes('top-pick')) {
    request.query.sort = '-ratingsAverage';
  }
  if (subUrl.url.includes('newly-added')) {
    request.query.sort = '-createdAt';
  }
  if (subUrl.url.includes('three-vehicle-only')) {
    console.log('Inside thre');
    request.query.categories = 'Three Wheeler';
  }
  if (subUrl.url.includes('four-vehicle-only')) {
    request.query.categories = 'Four Wheeler';
  }
  next();
};

exports.getGaragesWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit, subCat } = request.params;
  const [lat, lng] = latlng.split(',');
  console.log(distance, latlng, unit, subCat);
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat && !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  if (subCat.includes('top-pick')) {
    request.query.sort = '-ratingsAverage';
  }
  if (subCat.includes('newly-added')) {
    console.log('Inside at newly');
    request.query.sort = '-createdAt';
  }
  if (subCat.includes('three-wheeler-only')) {
    request.query.categories = 'Three Wheeler';
    request.query.sort = '-ratingsAverage';
  }
  if (subCat.includes('four-wheeler-only')) {
    request.query.categories = 'Four Wheeler';
    request.query.sort = '-ratingsAverage';
  }
  if (subCat.includes('two-wheeler-only')) {
    request.query.categories = 'Two Wheeler';
    request.query.sort = '-ratingsAverage';
  }

  let query = new APIFeatures(
    Garages.find({
      geometry: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    }),
    request.query
  );
  query = query.filter().sort().limitFields().paginate();
  const garages = await query.query;
  // const garages = await Garages.find({
  //   geometry: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  // });
  if (!garages) {
    response.status(400).json({
      status: 'fail',
      message: 'No garages in your area',
    });
  }
  response.status(200).json({
    status: 'success',
    results: garages.length,
    garages,
  });
});

exports.updateGarage = catchAsync(async (request, response, next) => {
  const queryObj = { ...request.body };
  const illegalFieldsToUpdate = ['email', 'phonenumber'];
  illegalFieldsToUpdate.forEach((field) => delete queryObj[field]);

  const updatedGarage = await Garages.findByIdAndUpdate(
    request.params.id,
    queryObj,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedGarage) return next(new AppError('No garages with this id'));
  response.status(200).json({
    status: 'success',
    message: 'Changes Updated successfully',
    data: updatedGarage,
  });
});

exports.addService = catchAsync(async (request, response, next) => {
  const {
    garage_id,
    category,
    name,
    price,
    description = null,
    img_url = null,
  } = request.body;

  const findGarageWithService = await Garages.find({
    $and: [
      {
        _id: garage_id,
      },
      {
        'service.name': name,
      },
    ],
  });
  if (findGarageWithService.length > 0)
    return next(new AppError('Duplicate service name found!', 404));
  const updatedGarage = await Garages.findByIdAndUpdate(
    garage_id,
    {
      $addToSet: {
        service: {
          category,
          name,
          price,
          description,
          img_url,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedGarage)
    return next(new AppError('There is no garage with this id !'), 404);
  response.status(200).json({
    status: 'success',
    message: 'service added succesfully',
    data: updatedGarage,
  });
});
