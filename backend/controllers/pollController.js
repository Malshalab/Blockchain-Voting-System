const Poll = require('../models/Polls');  // Adjusted to match the file name
const jwt = require('jsonwebtoken');

// Create Poll (POST)
const createPoll = async (req, res) => {
  try {
    const { title, description, options, startTime, endTime } = req.body;
    if (!title || !options || !startTime || !endTime) {
      return res.status(400).json({ error: "Error: Title, options, startTime, and endTime are missing" });
    }

    const existingPoll = await Poll.findOne({ title });
    if (existingPoll) {
      return res.status(401).json({ error: "Poll already exists" });
    }

    // Assume a default status and that createdBy is coming from authentication (or set a default)
    const newPoll = await Poll.create({ 
      title, 
      description, 
      options, 
      startTime, 
      endTime, 
      status: "upcoming",
      createdBy: req.user ? req.user.id : "607f1f77bcf86cd799439011"
    });

    const payload = { 
      id: newPoll._id, 
      title: newPoll.title, 
      description: newPoll.description, 
      options: newPoll.options, 
      startTime: newPoll.startTime, 
      endTime: newPoll.endTime 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
    return res.status(201).json({
      message: "Poll successfully registered",
      token,
      poll: {
        id: newPoll._id,
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options,
        startTime: newPoll.startTime,
        endTime: newPoll.endTime,
      },
    });
  } catch (error) {
    console.error('Error during poll registration:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { createPoll };