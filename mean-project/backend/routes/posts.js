const express = require("express");
// Use multer to handle image uploading
const multer = require("multer");
// custom middleware for verifying a jwt
const checkAuth = require("../middleware/check-auth");

const PostsController = require('../controllers/posts-controller');

// use express router
const router = express.Router();

// Create a map of mime types and thier corresponding extensions
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

// Configure image storate for uploaded images
const storage = multer.diskStorage({
  // set desination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    // use callback function to set destination
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    // get a normalized version of the file name
    const name = file.originalname.toLowerCase().split(" ").join("-");
    // get the file extension
    const ext = MIME_TYPE_MAP[file.mimetype];
    // return a unique filename
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// Posting a new app
// Use multer with storage config to expect a single image file
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostsController.createPost
);

// Return dummy post data when hit with a get request
router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

// update a specific post in the database by its id segment
router.patch(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostsController.updatePost
);

// :id is a dynamic path segment, since id's are generated in the database
// i.e. api/posts/a;lkejfqawe
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
