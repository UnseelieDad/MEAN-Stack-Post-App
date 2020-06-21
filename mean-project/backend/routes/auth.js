const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
// Import the user model
const User = require("../models/user");

// Route for signup
router.post("/signup", (req, res, next) => {
  // Use bcrypt to hash the incoming password
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash, // store password hash instead of password
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

//router.post();

module.exports = router;
