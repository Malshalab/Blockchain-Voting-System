import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import VotingTable from "../components/VotingTable";
import { getPolls } from "../api/polls";

// Define a type for your poll (adjust fields as needed)
export interface Poll {
  id: number;
  name: string;
  description: string;
  address: string;
  candidates?: { id: string; name: string; image: string }[]; // Made optional in case it's missing
  voters: number;
  expiry: { time: string; date: string };
  isActive: boolean;
  members: string[];
  status: "active" | "ended";
  voted?: boolean; // Optional, if you mark polls as voted
}

const Home = () => {
  // State for polls (array)
  const [polls, setPolls] = useState<Poll[]>([]);
  // State for the current filter and active tab
  const [filter, setFilter] = useState<"all" | "active" | "ended" | "voted">("all");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "ended" | "voted">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Using as const so that TS infers literal types for the value field
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
        // If the API response is an array, set it directly; otherwise, use the nested polls property
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

  // Filter polls based on the current filter value
  let filteredPolls: Poll[] = polls;
  if (filter === "active") {
    filteredPolls = polls.filter((poll) => poll.status === "active");
  } else if (filter === "ended") {
    filteredPolls = polls.filter((poll) => poll.status === "ended");
  } else if (filter === "voted") {
    filteredPolls = polls.filter((poll) => poll.voted);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex flex-col w-full h-screen">
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