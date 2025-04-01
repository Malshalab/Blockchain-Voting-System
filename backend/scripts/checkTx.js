// scripts/checkTx.js
const { ethers } = require("ethers");
require("dotenv").config();

// Set up provider (local Anvil)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your actual tx hash
const txHash = "0x81fc266b4a57433aef637fd43912307a2ddf94c7522c5a7f3f20d92e062770a9";

async function checkTransaction() {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    console.log("Transaction not found yet. It might still be pending.");
  } else {
    console.log("✅ Transaction Receipt:");
    console.log(receipt);
    console.log("Status:", receipt.status === 1 ? "Success ✅" : "Failed ❌");
  }
}

checkTransaction();
