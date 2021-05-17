const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Movie, validate } = require("../model/movie");
const { Genre } = require("../model/genre");

// Get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find()
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        status: 404,
        message: "Unable to fetch movies",
      });
    });
});

// Post(create) a movie
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = new Movie({
    name: req.body.name,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });

  await movie
    .save()
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get a movie
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.send("Movie with the given ID cannot be found");

  res.send(movie);
});

// Update a movie
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });

  await Movie.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: req.body.genre._id,
        name: req.body.genre.name,
      },
    },
    { new: true }
  )
    .then((movie) => {
      if (!movie)
        return res.status(404).json({
          status: 404,
          message: "Movie with the given ID cannot be found",
        });

      res.send(movie);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).send(err);
    });
});

// Delete a movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  res.send(movie);
});

module.exports = router;
