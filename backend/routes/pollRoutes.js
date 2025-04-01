// routes/pollRoutes.js
const express = require('express');
const router = express.Router();

const { createPoll, listPolls, updatePoll, deletePoll, voteOnPoll } = require('../controllers/pollController');

// Define a route for creating polls. This will be accessible at POST /polls/create if mounted correctly.
router.post('/create', createPoll);
router.post('/vote', voteOnPoll);
router.get('/', listPolls)
router.delete('/', deletePoll)
router.put("/", updatePoll)

module.exports = router;