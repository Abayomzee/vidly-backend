const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../model/customer");

// Get all customer
router.get("/", async (req, res) => {
  await Customer.find().then((customer) => {
    res.send(customer);
  });
});

// get a customer
router.get("/:id", async (req, res) => {
  await Customer.findById(req.params.id).then((customer) => {
    res.send(customer);
  });
});

// Post a customer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save().then((newCustomer) => {
    res.send(newCustomer);
  });
});

// Update a customer
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update first
  await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  ).then((customer) => {
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID cannot be found");

    res.send(customer);
  });
});

// Delete a customer
router.delete("/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id).then((customer) => {
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID cannot be found");

    res.send(customer);
  });
});

module.exports = router;
