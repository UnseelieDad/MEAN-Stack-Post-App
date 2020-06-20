// Import express
const express = require('express');

// Create an express app
const app = express();

// middleware function
app.use((req, res, next) => {
    console.log('First middleware');
    next();
});

app.use((req, res, next) => {
    res.send("Hello from express!");
});

// export the app for use in other files
module.exports = app;