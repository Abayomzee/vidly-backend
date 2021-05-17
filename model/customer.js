const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 200,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    minLength: 10,
    maxLength: 11,
  },
  isGold: Boolean,
});

const Customer = mongoose.model("Customer", customerSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    phone: Joi.string().min(10).max(11).required(),
    isGold: Joi.boolean().required(),
  });

  return schema.validate(data);
};

exports.Customer = Customer;
exports.validate = validate;
