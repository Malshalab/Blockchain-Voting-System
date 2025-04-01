const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');

dotenv.config();

// Load ABI from compiled artifact
const contractBuild = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../forge-contracts/out/DecentralizedVoting.sol/DecentralizedVoting.json")
  )
);
const abi = contractBuild.abi;

console.log("Loaded private key:", process.env.ADMIN_PRIVATE_KEY?.slice(0, 10) + "...");
console.log("Loaded contract address:", process.env.CONTRACT_ADDRESS);

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
const wallet = new ethers.Wallet(adminPrivateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, wallet);

module.exports = { contract };
