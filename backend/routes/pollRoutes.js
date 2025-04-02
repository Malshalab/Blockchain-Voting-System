const express = require('express');
const router = express.Router();
const { createPoll, listPolls, updatePoll, deletePoll } = require('../controllers/pollController');
const { votingContract } = require('../config/blockchain');
const Poll = require('../models/Polls'); 

// Define your routes here, no React code:
router.post('/create', createPoll);
router.get('/', listPolls);
router.delete('/', deletePoll);
router.put("/", updatePoll);

router.post('/createPollOnChain', async (req, res) => {
  try {
    const { question, options, description, startTime, endTime, status, createdBy } = req.body;

    if (!question || !options || options.length < 2 || !description || !startTime || !endTime || !status || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the blockchain contract's createPoll function.
    const tx = await votingContract.createPoll(question, options);
    console.log("Transaction object:", tx);
    const receipt = await tx.wait();

    // Log full receipt with BigInts converted to strings.
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;
    const safeReceiptString = JSON.stringify(receipt, replacer, 2);
    console.log("Full transaction receipt:", safeReceiptString);

    let events = receipt.events;
    // If events aren't automatically parsed, manually parse logs.
    if (!events || events.length === 0) {
      events = [];
      receipt.logs.forEach((log) => {
        try {
          const parsed = votingContract.interface.parseLog(log);
          events.push(parsed);
        } catch (err) {
          // Ignore logs that don't match the ABI events.
        }
      });
      console.log("Manually parsed events:", JSON.stringify(events, replacer, 2));
    }

    let onChainPollId = null;
    events.forEach((event) => {
      if (event.name === "PollCreated") {
        // Since event.args.pollId is already a string in this case, convert it to a number
        onChainPollId = Number(event.args[0]);
        console.log("Extracted on-chain poll id:", onChainPollId);
      }
    });

    if (onChainPollId === null) {
      console.error("Unable to determine on-chain poll id");
      return res.status(500).json({ error: "Unable to determine on-chain poll id" });
    }

    const pollNumber = Date.now();
    const pollOptions = options.map((opt, index) => ({
      optionId: index.toString(),
      label: opt
    }));

    const newPoll = new Poll({
      title: question,
      description,
      options: pollOptions,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status,
      createdBy,
      pollNumber,
      onChainPollId
    });

    await newPoll.save();

    return res.status(201).json({
      message: "Poll successfully registered on the blockchain and saved in the database",
      transactionHash: JSON.parse(safeReceiptString).transactionHash,
      events: JSON.parse(safeReceiptString).events,
      poll: newPoll
    });
  } catch (error) {
    console.error("Error creating poll on blockchain:", error);
    return res.status(500).json({ error: "Server error while creating poll on blockchain", details: error.message });
  }
});

// Cast a vote on the blockchain
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
    return res.status(500).json({ error: "Server error while casting vote on blockchain", details: error.message });
  }
});

// Retrieve on-chain poll vote counts
router.get('/getPollVotes/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    // Call the smart contract's getPollVotes method.
    const votes = await votingContract.getPollVotes(pollId);
    // Convert BigNumber values to strings
    const votesArray = votes.map(v => v.toString());

    const poll = await Poll.findOne({ onChainPollId: Number(pollId) });
    if (!poll) {
      return res.status(404).json({ error: "Poll not found in the database" });
    }

    // Merge the vote counts with the option labels.
    const results = poll.options.map((option, index) => ({
      optionId: option.optionId,
      label: option.label,
      votes: votesArray[index] || "0"
    }));

    return res.status(200).json({
      message: "Poll votes retrieved",
      results: results
    });
  } catch (error) {
    console.error("Error retrieving poll votes:", error);
    return res.status(500).json({ error: "Server error while retrieving poll votes", details: error.message });
  }
});

module.exports = router;