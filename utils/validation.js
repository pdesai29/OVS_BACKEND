const Joi = require('joi');

const registrationValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phonenumber: Joi.string()
      .min(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    phonenumber: Joi.string()
      .min(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = { registrationValidation, loginValidation };
