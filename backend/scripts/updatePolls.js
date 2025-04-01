// updatePolls.js
require('dotenv').config();
const mongoose = require('mongoose');
const Poll = require('./models/Polls'); // Adjust the path if necessary

// Use your Atlas connection string from your .env file.
// Note: Your .env file has MONGO_URI, so make sure you use that variable.
const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_db_name";

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected.");
  return updatePolls();
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

async function updatePolls() {
  try {
    // Update polls where onChainPollId is missing or null
    const result = await Poll.updateMany(
      { $or: [ { onChainPollId: { $exists: false } }, { onChainPollId: null } ] },
      { $set: { onChainPollId: 0 } }  // Set a default value of 0 (or another appropriate value)
    );
    console.log("Update result:", result);
  } catch (error) {
    console.error("Error updating polls:", error);
  } finally {
    mongoose.disconnect();
  }
}