const express = require('express');
// Use multer to handle image uploading
const multer = require('multer');
// Import post model
const Post = require('../models/post');
// custom middleware for verifying a jwt 
const checkAuth = require('../middleware/check-auth');

// use express router
const router = express.Router();

// Create a map of mime types and thier corresponding extensions
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
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
        const name = file.originalname.toLowerCase().split(' ').join('-');
        // get the file extension
        const ext = MIME_TYPE_MAP[file.mimetype];
        // return a unique filename
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

// Posting a new app
// Use multer with storage config to expect a single image file
router.post('', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    // get main server url
    const url = req.protocol + '://' + req.get('host');
    // Create a new mongoose model for the post
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    // save post to database
    post.save()
    // Get teh returned post with the generated id
    // and send the id back in the response so it can be set
    // in the frontend
        .then(createdPost => {
            res.status(201).json({
                message: "Post added successfully!",
                post: {
                    id: createdPost._id,
                    title: createdPost.title,
                    content: createdPost.content,
                    imagePath: createdPost.imagePath
                }
            });
        });
});

// Return dummy post data when hit with a get request
router.get('', (req, res, next) => {
    // Query parameters for pagination
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    // if query parameters present, adjust the database query
    if (pageSize && currentPage) {
        postQuery
            // skip previous pages
            .skip(pageSize * (currentPage - 1))
            // limit returned pages to page size
            .limit(pageSize);
    }
    // Return all entries in the mongo collection for the Post model
    postQuery
        .then(documents => {
            // get teh documents then query the number of posts
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            // Return posts and their count
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(errors => {
            console.log(errors);
        });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                });
            }
        });
});

// update a specific post in the database by its id segment
router.patch("/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    // If request includes imge as a file set image path to this instead
    if (req.file) {
        // get main server url
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post Updated!'
            });
        });
});

// :id is a dynamic path segment, since id's are generated in the database
// i.e. api/posts/a;lkejfqawe
router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
           console.log(result);
           res.status(200).json({ message: "Post deleted!" }); 
        });
});

module.exports = router;