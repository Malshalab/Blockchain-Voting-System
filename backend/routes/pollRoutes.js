// routes/pollRoutes.js
const express = require('express');
const router = express.Router();

const { createPoll, listPolls, updatePoll, deletePoll } = require('../controllers/pollController');

// Define a route for creating polls. This will be accessible at POST /polls/create if mounted correctly.
router.post('/create', createPoll);
router.get('/', listPolls)
router.delete('/', deletePoll)
router.put("/", updatePoll)


// Create poll on blockchain and then (optionally) update your DB accordingly.
router.post('/createPollOnChain', async (req, res) => {
    try {
      const { question, options } = req.body;
      if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: "Error: Title, options, and at least two options are required" });
      }
      
      // Call the smart contract's createPoll function.
      const tx = await votingContract.createPoll(question, options);
      const receipt = await tx.wait();
      
      // Optionally, you can parse receipt events to get on-chain poll ID
      console.log("Poll created on-chain, transaction hash:", receipt.transactionHash);
      
      // Here, you might update your database with on-chain details.
      return res.status(201).json({
        message: "Poll successfully registered on the blockchain",
        transactionHash: receipt.transactionHash,
        events: receipt.events
      });
    } catch (error) {
      console.error("Error creating poll on blockchain:", error);
      return res.status(500).json({ error: "Server error while creating poll on blockchain" });
    }
  });

  router.post('/voteOnChain', async (req, res) => {
    try {
      const { pollId, optionIndex } = req.body;
      if (pollId == null || optionIndex == null) {
        return res.status(400).json({ error: "Poll ID and option index are required" });
      }
      
      const tx = await votingContract.vote(pollId, optionIndex);
      const receipt = await tx.wait();
      console.log("Vote cast on-chain, transaction hash:", receipt.transactionHash);
      return res.status(200).json({
        message: "Vote successfully cast on the blockchain",
        transactionHash: receipt.transactionHash,
        events: receipt.events
      });
    } catch (error) {
      console.error("Error casting vote on blockchain:", error);
      return res.status(500).json({ error: "Server error while casting vote on blockchain" });
    }
  });

module.exports = router;