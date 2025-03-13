const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  options: [
    {
      optionId: { type: String, required: true },
      label: { type: String, required: true },
    }
  ],
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    required: true 
  }, // e.g., "upcoming", "active", "closed"
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Specify the collection name "Polls" as the third argument.
module.exports = mongoose.model('Poll', pollSchema, 'Polls');