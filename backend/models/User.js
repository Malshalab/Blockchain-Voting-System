// backend/models/User.js
const mongoose = require('mongoose');

// 1. Define a schema
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
  // add any other fields you need
});

// 2. Create and export the model
module.exports = mongoose.model('User', userSchema);