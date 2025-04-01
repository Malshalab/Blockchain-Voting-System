// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import VotingTable from "../components/VotingTable";
import { getPolls } from "../api/polls";

// Update the Poll interface to reflect the backend schema.
export interface Poll {
  _id: string;                   // MongoDB document ID
  title: string;                 // Poll title
  description: string;           // Poll description
  options: {
    optionId: string;            // Option ID (string version of index)
    label: string;               // Option label
    _id?: string;                // Option's Mongo ID (optional)
  }[];
  startTime: string;             // ISO date string for poll start time
  endTime: string;               // ISO date string for poll end time
  status: "active" | "ended";    // Poll status
  createdBy: string;             // User ID of the poll creator
  pollNumber: number;            // Unique poll number
  onChainPollId: number;         // Poll ID from the blockchain
  // Optionally, add other fields (e.g., voters count, members, voted flag) as needed
}

const Home = () => {
  // State for polls (array)
  const [polls, setPolls] = useState<Poll[]>([]);
  // State for current filter and active tab
  const [filter, setFilter] = useState<"all" | "active" | "ended" | "voted">("all");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "ended" | "voted">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Define filter tabs
  const tabs = [
    { name: "All Polls", value: "all" },
    { name: "Active", value: "active" },
    { name: "Ended", value: "ended" },
    { name: "My Voted", value: "voted" },
  ] as const;

  // Fetch polls from the backend when the component mounts
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls();
        console.log("Polls data:", data);
        // Assuming the API response returns { polls: [...] }
        setPolls(Array.isArray(data) ? data : data.polls);
      } catch (err) {
        console.error("Error fetching polls:", err);
        setError("Failed to fetch polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Filter polls based on the current filter value.
  // (If your backend doesn't send a "voted" flag, adjust or remove that filter.)
  let filteredPolls: Poll[] = polls;
  if (filter === "active") {
    filteredPolls = polls.filter((poll) => poll.status === "active");
  } else if (filter === "ended") {
    filteredPolls = polls.filter((poll) => poll.status === "ended");
  } else if (filter === "voted") {
    // Adjust this logic based on your backend data if needed.
    filteredPolls = polls.filter((poll) => (poll as any).voted);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex flex-col w-full h-full">
        <TopBar title="Polling Dashboard" />
        <div className="flex flex-col flex-grow p-6 h-full">
          {/* Filter Tabs */}
          <div>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 rounded-t-lg mr-4 ${
                  activeTab === tab.value ? "bg-white" : "bg-transparent"
                } hover:bg-${activeTab === tab.value ? "blue" : "gray"}-300`}
                onClick={() => {
                  setActiveTab(tab.value);
                  setFilter(tab.value);
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Loading, Error, or Poll Table */}
          {loading ? (
            <p>Loading polls...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex-grow overflow-hidden h-full">
              <VotingTable
                title={`${filter.charAt(0).toUpperCase() + filter.slice(1)} Polls`}
                data={filteredPolls}
                isActive={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;