// scripts/listFunctions.js
const fs = require("fs");
const path = require("path");

const contractBuild = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../forge-contracts/out/DecentralizedVoting.sol/DecentralizedVoting.json")
    )
  );  
  
const abi = contractBuild.abi;

console.log("✅ Available functions in ABI:");
abi.filter(f => f.type === "function").forEach(f => console.log(" -", f.name));
