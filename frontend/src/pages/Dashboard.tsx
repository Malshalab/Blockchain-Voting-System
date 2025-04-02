// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getPolls, getPollVotesBackend } from "../api/polls";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Update the Poll interface to include onChainPollId and voteCounts.
export interface Poll {
  id: string;               // MongoDB document ID (transformed from _id)
  title: string;            // Poll title
  voteCounts: number[];     // Array of vote counts for each option (from DB)
  status: "active" | "ended"; 
  createdAt: string;        // ISO timestamp
  onChainPollId: number;    // Poll ID on the blockchain
}

interface PollResult {
  label: string;
  optionId: string;
  votes: number;
}


const Dashboard: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResult[]>([]);

  // Fetch poll data from the backend and transform each poll so that _id becomes id and voteCounts is defined.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPolls();
        console.log("Raw polls data:", data);
        const transformedPolls = data.polls.map((poll: any) => ({
          ...poll,
          id: poll._id, // Map _id to id.
          voteCounts: poll.voteCounts ? poll.voteCounts : [] // Default to empty array if missing.
        }));
        setPolls(transformedPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Aggregated data for charts

  // Donut chart: Poll Distribution by Status
  const donutData = [
    { name: "Active", value: polls.filter((p) => p.status === "active").length },
    { name: "Ended", value: polls.filter((p) => p.status === "ended").length },
  ];
  const donutColors = ["#6366F1", "#F59E0B"];

  // Area chart: Total Votes Over Time (aggregated by day)
  const areaDataMap: { [date: string]: number } = {};
  polls.forEach((poll) => {
    const date = new Date(poll.createdAt).toLocaleDateString();
    // Sum votes using voteCounts from the DB (or fallback to pollResults if needed)
    const totalVotes = poll.voteCounts ? poll.voteCounts.reduce((sum, count) => sum + count, 0) : 0;
    areaDataMap[date] = (areaDataMap[date] || 0) + totalVotes;
  });
  const areaData = Object.keys(areaDataMap)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => ({ date, totalVotes: areaDataMap[date] }));

  // Line chart: Poll Creation Trend (polls per month)
  const lineDataMap: { [month: string]: number } = {};
  polls.forEach((poll) => {
    const d = new Date(poll.createdAt);
    const month = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
    lineDataMap[month] = (lineDataMap[month] || 0) + 1;
  });
  const lineData = Object.keys(lineDataMap)
    .sort((a, b) => a.localeCompare(b))
    .map((month) => ({ month, pollsCreated: lineDataMap[month] }));

  // Function to fetch vote results from the backend using the poll's onChainPollId.
  const fetchPollResults = async (poll: Poll) => {
    try {
      console.log("Fetching vote results for poll:", poll.title);
      const result = await getPollVotesBackend(poll.onChainPollId);
      console.log("Fetched poll results (raw):", result);
      // Map the received results to our PollResult interface.
      const transformedResults = result.results.map((item: any) => ({
        label: item.label,
        optionId: item.optionId,
        votes: Number(item.votes)
      }));
      setPollResults(transformedResults);
    } catch (error) {
      console.error("Error fetching poll results:", error);
      setPollResults([]);
    }
  };

  // Handler when a poll is selected from the dropdown.
  const handlePollSelection = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pollId = e.target.value;
    const poll = polls.find((p) => p.id === pollId) || null;
    setSelectedPoll(poll);
    if (poll) {
      await fetchPollResults(poll);
    } else {
      setPollResults([]);
    }
  };

  // Prepare chart data using the fetched pollResults
  const voteChartData = pollResults.map((vote, index) => ({
    name: `Option ${index + 1}`,
    value: vote,
  }));

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="ml-64 flex flex-col w-full h-full">
        <TopBar title="Dashboard" />
        {loading ? (
          <p className="p-6">Loading dashboard...</p>
        ) : (
          <div className="grid p-6 grid-cols-1 gap-6 xl:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Donut Chart: Poll Distribution by Status */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">Polls by Status</h3>
                    <span className="text-gray-500">Total Polls: {polls.length}</span>
                  </div>
                  <div className="flex items-center justify-center h-72 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          label
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around text-sm text-gray-700">
                    {donutData.map((d, i) => (
                      <div key={i}>
                        {d.name}: {d.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area Chart: Total Votes Over Time */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-50 rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">Total Votes Over Time</h3>
                    <span className="text-gray-500">Aggregated by Day</span>
                  </div>
                  <div className="relative h-72 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData}>
                        <defs>
                          <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip />
                        <Area type="monotone" dataKey="totalVotes" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVotes)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Line Chart: Poll Creation Trend */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-50 rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">Poll Creation Trend</h3>
                    <span className="text-gray-500">Polls per Month</span>
                  </div>
                  <div className="h-72 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pollsCreated" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* New Section: Poll Voting Results */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Poll Voting Results</h3>
                <select
                  className="border border-gray-300 rounded p-2 mb-4 w-full"
                  onChange={handlePollSelection}
                >
                  <option value="">Select a poll</option>
                  {polls.map((poll) => (
                    <option key={poll.id} value={poll.id}>
                      {poll.title}
                    </option>
                  ))}
                </select>
                {selectedPoll ? (
                  pollResults.some(result => result.votes > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pollResults}
                          dataKey="votes"
                          nameKey="label"
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
                  ) : (
                    <p className="text-gray-500">No vote results available for this poll.</p>
                  )
                ) : (
                  <p className="text-gray-500">Select a poll to view its vote counts.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;