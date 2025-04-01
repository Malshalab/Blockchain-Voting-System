const Poll = require('../models/Polls');  // Adjusted to match the file name
const jwt = require('jsonwebtoken');
const { contract } = require("../blockchainService"); // Adjusted to match the file name
const { ethers } = require("ethers");

const voteOnPoll = async (req, res) => {
  try {
    const { pollId, candidateId, voterHash } = req.body;

    if (!pollId || !candidateId || !voterHash) {
      return res.status(400).json({ error: 'Missing pollId, candidateId, or voterHash' });
    }

    // ✅ Convert pollId and candidateId to BigInt
    const pollIdInt = BigInt(pollId);
    const candidateIdInt = BigInt(candidateId);

    // ✅ Hash the voter identifier (e.g. wallet address)
    const voterHashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(voterHash));

    console.log("pollIdInt:", pollIdInt);
    console.log("candidateIdInt:", candidateIdInt);
    console.log("voterHashBytes32:", voterHashBytes32);
    // Call the smart contract's vote method
    const tx = await contract.vote(pollIdInt, candidateIdInt, voterHashBytes32);
    await tx.wait(); // Wait for transaction to be mined

    return res.status(200).json({ message: 'Vote cast successfully', txHash: tx.hash });
  } catch (err) {
    console.error('Vote Error (full):', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    return res.status(500).json({ error: 'Voting failed on server' });
  }  
};


// Update POLL (PUT/PATCH)
const updatePoll = async(req,res) =>{
    try{
    const pollTitle=req.query.title
    //find the entry I want to edit

    }
    catch(error){

    }
}

//Delete Poll
const deletePoll= async (req,res) => {
    try{
        const pollTitle= req.query.title
        if(!pollTitle){
            return res.status(400).json({error:"enter a correct poll name"})
        }

        const wantedPoll = await Poll.findOneAndDelete({title: pollTitle})
        if(!wantedPoll){
            return res.status(404).json({error:"Poll not found"})
        }
        return res.status(200).json({ message: 'Poll successfully deleted', poll: deletedPoll });

    } catch(error){
        console.error('Error fetching polls:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
}

// List all Polls/ find specific polls based on filer (GET)
const listPolls = async (req, res) => {
    try {
      // Optionally filter polls by title using a query parameter
      const filter = {};
      if (req.query.title) {
        filter.title = { $regex: req.query.title, $options: 'i' };
      }

      if (req.query.status) {
        filter.status = req.query.status;
      }
      // Retrieve all polls (or filtered polls) from the database
      const polls = await Poll.find(filter);
      
      const now = new Date();

      // Step 2: Check and update expired polls
      const updatedPolls = await Promise.all(
        polls.map(async (poll) => {
          if (poll.status === "active" && new Date(poll.endTime) < now) {
            poll.status = "ended";
            await poll.save(); // Update DB
          }
          return poll;
        })
      );

      // Step 3: Return the updated list
      return res.status(200).json({ polls: updatedPolls });
    } catch (error) {
      console.error('Error fetching polls:', error);
      return res.status(500).json({ error: 'Server error.' });
    }
  };
  

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

    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

    // 2. Create poll on the smart contract
    const tx = await contract.createPoll(title, startTimestamp, endTimestamp);
    await tx.wait(); // Wait for the transaction to be mined

    const totalPolls = await Poll.countDocuments();
    const pollNumber = totalPolls + 1;

    // Assume a default status and that createdBy is coming from authentication (or set a default)
    const newPoll = await Poll.create({ 
      title, 
      description, 
      options, 
      startTime, 
      endTime, 
      status: "active",
      createdBy: req.user ? req.user.id : "607f1f77bcf86cd799439011",
      pollNumber
    });

    const payload = { 
      id: newPoll._id, 
      title: newPoll.title, 
      description: newPoll.description, 
      options: newPoll.options, 
      startTime: newPoll.startTime, 
      endTime: newPoll.endTime,
      pollNumber: newPoll.pollNumber,
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
        pollNumber: newPoll.pollNumber,
      },
    });
  } catch (error) {
    console.error('Error during poll registration:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { createPoll,listPolls, deletePoll, updatePoll, voteOnPoll };