const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Poll = require('../models/Polls'); // Ensure path is correct

const updateExistingPolls = async () => {
  try {
    // Fetch all polls to assign a sequential pollNumber
    const polls = await Poll.find({});
    
    const updates = await Promise.all(
      polls.map(async (poll, index) => {
        // Assign pollNumber as 1-based index
        poll.pollNumber = index + 1;
        return poll.save();
      })
    );

    console.log(`Updated ${updates.length} polls with pollNumber.`);
  } catch (error) {
    console.error("Error updating polls:", error);
  } finally {
    mongoose.connection.close();
  }
};

mongoose.connect('process.env.MONGO_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB. Updating polls...");
  updateExistingPolls();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
