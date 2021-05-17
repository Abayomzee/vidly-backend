const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../model/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all genres
router.get("/", async (req, res) => {
  await Genre.find().then((genres) => {
    res.send(genres);
  });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = {
    name: req.body.name,
  };

  await Genre.findByIdAndUpdate(req.params.id, newGenre, { new: true }).then(
    (updatedResult) => {
      res.send(updatedResult);
    }
  );
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  await Genre.findById(req.params.id).then((genre) => {
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  });
});

module.exports = router;
