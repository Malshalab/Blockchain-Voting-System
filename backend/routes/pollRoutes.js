// routes/pollRoutes.js
const express = require('express');
const router = express.Router();

const { createPoll, listPolls } = require('../controllers/pollController');

// Define a route for creating polls. This will be accessible at POST /polls/create if mounted correctly.
router.post('/create', createPoll);
router.get('/', listPolls)

module.exports = router;