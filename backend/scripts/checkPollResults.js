const { contract } = require("../blockchainService");

async function getPollSummaries() {
  try {
    const count = await contract.pollCount();

    for (let pollId = 1; pollId <= count; pollId++) {
      const [title, startTime, endTime, active, candidateCount] = await contract.getPollSummary(pollId);
      console.log(`📊 Poll ${pollId}: ${title}`);
      console.log(`⏰ ${new Date(startTime * 1000).toLocaleString()} - ${new Date(endTime * 1000).toLocaleString()}`);
      console.log(`✅ Active: ${active}, 🧑‍💼 Candidates: ${candidateCount}`);

      const [_, candidateIds, voteCounts] = await contract.getPollResults(pollId);
      console.log(`🗳️ Results:`);
      candidateIds.forEach((id, i) => {
        console.log(`   Candidate #${id}: ${voteCounts[i]} votes`);
      });

      console.log("---------------------------------------------------");
    }
  } catch (err) {
    console.error("Error fetching poll summaries:", err);
  }
}

getPollSummaries();
