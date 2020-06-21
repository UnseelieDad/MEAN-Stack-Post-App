// Import express
const express = require('express');

// Import parser for incoming JSON data
const bodyParser = require('body-parser');

// Create an express app
const app = express();

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

app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: "Post added successfully!"
    });
});

// Return dummy post data when hit with a get request
app.get('/api/posts', (req, res, next) => {
    const posts = [
        { 
            id: 'sdlkfjoiwe', 
            title: 'First serverside post.', 
            content: 'This is coming from the backend.' 
        },
        {
            id: 'adlkfjoweijf',
            title: 'Second serverside post',
            content: 'This is coming from the server.'
        }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
    });
});

// export the app for use in other files
module.exports = app;