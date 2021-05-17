const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          minLength: 3,
          maxLength: 200,
        },
        phone: {
          type: String,
          minLength: 10,
          maxLength: 11,
        },
      }),
      required: true,
    },

    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          maxLength: 225,
        },
        dailyRentalRate: {
          type: Number,
          min: 0,
          max: 255,
          default: 0,
        },
      }),
      required: true,
    },

    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dateReturned: {
      type: Date,
    },

    rentalFee: {
      type: Number,
      default: 0,
    },
  })
);

function validate(data) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(data);
}

module.exports = {
  Rental,
  validate,
};
