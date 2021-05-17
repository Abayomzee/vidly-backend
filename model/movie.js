const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 225,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    default: 0,
  },
  genre: {
    type: genreSchema,
    require: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    numberInStock: Joi.number().default(0).required(),
    dailyRentalRate: Joi.number().default(0).required(),
    genreId: Joi.objectId().required(),
  });

  return schema.validate(data);
}

module.exports = {
  Movie,
  validate,
};
