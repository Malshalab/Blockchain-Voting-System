// scripts/testPollCount.js
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

dotenv.config();

const contractBuild = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../forge-contracts/out/DecentralizedVoting.sol/DecentralizedVoting.json")
  )
);
const abi = contractBuild.abi;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, provider);

async function checkPollCount() {
  try {
    const count = await contract.pollCount();
    console.log("✅ pollCount:", count.toString());
  } catch (err) {
    console.error("❌ Error reading pollCount:", err);
  }
}

checkPollCount();
