// blockchain.js
require('dotenv').config();
const { ethers } = require('ethers');
const VotingArtifact = require('../build/contracts/Voting.json'); // Adjust the path if needed

// Connect to your local blockchain (Ganache)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:7545");

// Use an account to send transactions (this should be secured; for testing only)
const walletPrivateKey = process.env.PRIVATE_KEY; // Set this in your .env file
const wallet = new ethers.Wallet(walletPrivateKey, provider);

// Get the deployed contract address from your environment variables
const votingContractAddress = process.env.VOTING_CONTRACT_ADDRESS; // Set this after deployment
const votingContract = new ethers.Contract(votingContractAddress, VotingArtifact.abi, wallet);

module.exports = votingContract;