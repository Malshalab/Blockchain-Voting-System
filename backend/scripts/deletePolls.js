// backend/scripts/deletePolls.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Optionally, if your .env file is in the project root:
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Log the Mongo URI to debug
console.log("MONGO_URI:", process.env.MONGO_URI);

// Import the Poll model. Make sure the path is correct and matches your model file.
const Poll = require('../models/Polls');

// Define the deletion function. Here we delete polls created more than 30 days ago.
const deleteOldPolls = async () => {
  try {
    // Calculate the threshold date (30 days ago)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    // Delete polls where createdAt is less than the threshold date.
    const result = await Poll.deleteMany({ createdAt: { $lt: thresholdDate } });
    console.log(`Deleted ${result.deletedCount} old polls.`);
  } catch (error) {
    console.error("Error deleting old polls:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to the database then run the deletion function.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB. Deleting old polls...");
    deleteOldPolls();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });