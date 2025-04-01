const { getAddress, Wallet, JsonRpcProvider, Contract } = require("ethers");
const path = require("path");

// Adjust the path so it points to your Voting.json file in the frontend
const votingArtifactPath = path.join(__dirname, "../../frontend/src/Voting.json");
const VotingArtifact = require(votingArtifactPath);

// Read environment variables from your .env file
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VOTING_CONTRACT_ADDRESS = process.env.VOTING_CONTRACT_ADDRESS;

if (!PRIVATE_KEY) {
  console.error("Error: PRIVATE_KEY is not set in your environment.");
  process.exit(1);
}

if (!VOTING_CONTRACT_ADDRESS) {
  console.error("Error: VOTING_CONTRACT_ADDRESS is not set in your environment.");
  process.exit(1);
}

// Convert the contract address to a checksummed address using the destructured getAddress
const checksummedAddress = getAddress(VOTING_CONTRACT_ADDRESS.toLowerCase());

// Create ethers provider and wallet using ethers v6 syntax
const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

// Create the contract instance using the checksummed address
const votingContract = new Contract(checksummedAddress, VotingArtifact.abi, wallet);

module.exports = { votingContract };