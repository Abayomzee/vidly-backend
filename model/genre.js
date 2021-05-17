const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: String,
});

const Genre = mongoose.model("Genre", genreSchema);

const validate = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
};

// exports.Genre = Genre;
// exports.validate = validate;

module.exports = {
  Genre,
  validate,
  genreSchema,
};
