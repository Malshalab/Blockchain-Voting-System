// routes/pollRoutes.js
const express = require('express');
const router = express.Router();

const { createPoll } = require('../controllers/pollController');

// Define a route for creating polls. This will be accessible at POST /polls/create if mounted correctly.
router.post('/create', createPoll);

module.exports = router;