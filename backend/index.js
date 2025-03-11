const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
  res.send('Blockchain Voting System Backend Running!');
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
