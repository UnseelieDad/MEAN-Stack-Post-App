const mongoose = require('mongoose');

// Use mongoose to create a schema for the post data
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

// Export a mongoose model using the schema
module.exports = mongoose.model('Post', postSchema);