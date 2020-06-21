const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Use mongoose to create a schema for the user data
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Plug unique validator into the schema to make sure the email is unique
userSchema.plugin(uniqueValidator);

// Export a mongoose model using the schema
module.exports = mongoose.model('User', userSchema);