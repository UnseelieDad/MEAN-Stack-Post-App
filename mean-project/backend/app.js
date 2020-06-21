// For constructing paths
const path = require('path');
// Import express
const express = require('express');
// Import parser for incoming JSON data
const bodyParser = require('body-parser');
// Import Mongoose to work with the database
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

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
// Make images folder accessible
app.use('/images', express.static(path.join('backend/images')));

// Set CORS access so that request goes through regardless of domain
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    // Allow cors access for listed header types
    res.setHeader(
        'Access-Control-Allow-Headers', 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // Allow listed HTTP methods
    // May need to add PUT here later
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

// Use routes defined in posts.js
app.use('/api/posts', postRoutes);
// Use routes defined in auth.js
app.use('/api/auth', authRoutes);

// export the app for use in other files
module.exports = app;