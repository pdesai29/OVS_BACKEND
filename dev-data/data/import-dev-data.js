const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const mongoose = require('mongoose');
// const garages = require('./../../models/garagesModel');
const garages = require('../../models/garagesModels');

// IMPORT AND EXPORT TO ONLINE DATABASE
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD_OVS
);
// IMPORT AND EXPORT TO LOCAL DATABASE
// const DB = process.env.DATABASE_LOCAL.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );
(async () => {
  console.log(DB);
  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'));

  // READ JSON FILE
  const garagesData = JSON.parse(
    fs.readFileSync(`${__dirname}/garages.json`, 'utf-8')
  );

  const deleteData = async () => {
    try {
      await garages.deleteMany();
      console.log('Data deleted successfully');
    } catch (err) {
      console.log('Error in deleting...\n' + err);
    }
    process.exit();
  };

  const importData = async () => {
    try {
      await garages.create(garagesData);
      console.log('Data imported successfully');
    } catch (err) {
      console.log('Error in importing...\n' + err);
    }
    process.exit();
  };

  // IMPORT DATA INTO DB
  process.argv.forEach((item) => {
    if (item === '--delete') {
      deleteData();
    }
  });

  process.argv.forEach((item) => {
    if (item === '--import') {
      importData();
    }
  });
})();
