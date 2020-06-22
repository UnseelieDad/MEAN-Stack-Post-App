const express = require("express");

// custom middleware for verifying a jwt
const checkAuth = require("../middleware/check-auth");

// middleware using multer for validating image files
const checkFile = require("../middleware/check-file");

const PostsController = require("../controllers/posts-controller");

// use express router
const router = express.Router();

// Posting a new app
// Use multer with storage config to expect a single image file
router.post("", checkAuth, checkFile, PostsController.createPost);

// Return dummy post data when hit with a get request
router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

// update a specific post in the database by its id segment
router.patch("/:id", checkAuth, checkFile, PostsController.updatePost);

// :id is a dynamic path segment, since id's are generated in the database
// i.e. api/posts/a;lkejfqawe
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
