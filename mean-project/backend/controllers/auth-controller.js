const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Import the user model
const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  // Search for a user with the entered email in the database
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      // Authentication failed
      return res.status(401).json({
        message: "Invalid email!",
      });
    }
    fetchedUser = user;
    // Compare the hash generated by the incomming password to the one stored in the database
    return bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          // Invalid match
          return res.status(401).json({
            message: "Invalid password!",
          });
        }
        // Matched password in database
        // Keep track of user with a json web token
        const token = jwt.sign(
          { emai: fetchedUser.email, userId: fetchedUser._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        // Send token up to the frontend
        res.status(200).json({
          message: "User logged in!",
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
        });
      })
      .catch((err) => {
        // Authentication failed
        return res.status(401).json({
          message: "Invalid authentication credentials!",
          error: err,
        });
      });
  });
};
