// Import express
const express = require('express');
// Import parser for incoming JSON data
const bodyParser = require('body-parser');
// Import Mongoose to work with the database
const mongoose = require('mongoose');

// Import post model
const Post = require('./models/post');

// Create an express app
const app = express();

// Connect to the mongodb database
mongoose.connect("mongodb+srv://Seth:uOq2M0U8E0ZFvgRM@cluster0-fxnvy.mongodb.net/mean-app?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed');
    });

// Parse any incoming json data
app.use(bodyParser.json());
// Parse encoded urls
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS access so that request goes through regardless of domain
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    // Allow cors access for listed header types
    res.setHeader(
        'Access-Control-Allow-Headers', 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    // Allow listed HTTP methods
    // May need to add PUT here later
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// Posting a new app
app.post("/api/posts", (req, res, next) => {
    // Create a new mongoose model for the post
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    // save post to database
    post.save();
    console.log(post)
    res.status(201).json({
        message: "Post added successfully!"
    });
});

// Return dummy post data when hit with a get request
app.get('/api/posts', (req, res, next) => {
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

// export the app for use in other files
module.exports = app;