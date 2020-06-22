// Use multer to handle image uploading
const multer = require("multer");

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

module.exports = multer({ storage: storage }).single("image");
