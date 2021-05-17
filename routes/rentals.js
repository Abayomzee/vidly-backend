const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const router = express.Router();
const { Rental, validate } = require("../model/rental");
const { Customer } = require("../model/customer");
const { Movie } = require("../model/movie");

Fawn.init(mongoose);

// Get all rental
router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

// Post a rental
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer ID");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie ID");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },

    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;
