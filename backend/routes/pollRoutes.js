const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
const [pollResults, setPollResults] = useState<number[]>([]);

import { getPollVotesBackend } from "../api/polls";

const fetchPollResults = async (poll: Poll) => {
  try {
    const result = await getPollVotesBackend(poll.id);
    setPollResults(result.votes.map(Number));
  } catch (error) {
    console.error("Error fetching poll results:", error);
  }
};

/* Poll Results Section */
<div className="bg-white rounded-xl shadow p-4 md:p-6">
  <h3 className="text-lg md:text-xl font-semibold mb-4">Poll Results</h3>
  <select
    className="border border-gray-300 rounded p-2 mb-4 w-full"
    onChange={(e) => {
      const poll = polls.find(p => p.id === e.target.value);
      setSelectedPoll(poll || null);
      if (poll) fetchPollResults(poll);
    }}
  >
    <option value="">Select a poll</option>
    {polls.map((poll) => (
      <option key={poll.id} value={poll.id}>
        {poll.title}
      </option>
    ))}
  </select>

  {selectedPoll && pollResults.length > 0 && (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={selectedPoll.voteCounts.map((count, index) => ({
            name: `Option ${index + 1}`,
            value: pollResults[index],
          }))}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pollResults.map((_, index) => (
            <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )}
</div>