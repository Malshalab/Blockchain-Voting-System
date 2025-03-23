// backend/scripts/updateUsers.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Corrected relative path to the User model:
const User = require('../models/User'); // Instead of '../backend/models/User'

const updateExistingUsers = async () => {
  try {
    // This sets the 'isAdmin' field to false for all documents
    const result = await User.updateMany({ walletAddress: { $exists: false } }, { $set: { walletAddress: null, isAdmin: false } });
    console.log("Update result:", result);
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to the database before running the update
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB. Updating users...");
    updateExistingUsers();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });