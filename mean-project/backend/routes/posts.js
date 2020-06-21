const express = require('express');

// Import post model
const Post = require('../models/post');

// use express router
const router = express.Router();

// Posting a new app
router.post('', (req, res, next) => {
    // Create a new mongoose model for the post
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    // save post to database
    post.save()
    // Get teh returned post with the generated id
    // and send the id back in the response so it can be set
    // in the frontend
        .then(createdPost => {
            res.status(201).json({
                message: "Post added successfully!",
                postId: createdPost._id
            });
        });
    console.log(post);
});

// Return dummy post data when hit with a get request
router.get('', (req, res, next) => {
    // Return all entries in the mongo collection for the Post model
    Post.find()
        .then(documents => {
            // Wait for the documents to arrive then format response
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documents
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
router.patch("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
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
router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
           console.log(result);
           res.status(200).json({ message: "Post deleted!" }); 
        });
});

module.exports = router;