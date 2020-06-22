const express = require("express");
const router = express.Router();

const AuthController = require('../controllers/auth-controller');

// Route for signup
router.post("/signup", AuthController.createUser);

router.post('/login', AuthController.userLogin);

module.exports = router;
