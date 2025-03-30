import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoteModal from "./VoteModal";
import CreateVote from "./CreateVote";

const VotingTable = ({ title, data, isActive }) => {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [createVote, setCreateVote] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Utility to format deadline from poll.endTime
  const formatDeadline = (endTime) => {
    if (!endTime) return "No deadline";
    // If endTime is an object with a $date property (as in your DB), convert it
    if (endTime.$date && endTime.$date.$numberLong) {
      return new Date(Number(endTime.$date.$numberLong)).toLocaleString();
    }
    // Otherwise, assume it's a date string or a valid date
    return new Date(endTime).toLocaleString();
  };

    useEffect(() => {
      const storedAdminStatus = localStorage.getItem("isAdmin");
      console.log('admin status', storedAdminStatus);
      if (storedAdminStatus === null) {
          localStorage.setItem("isAdmin", "false");
          setIsAdmin(false);
      } else {
          setIsAdmin(storedAdminStatus === "true");
      }
    }, [])

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when data changes
  }, [data]);

  return (
    <div className="bg-white shadow-lg rounded-b-lg rounded-r-lg p-6 h-full flex flex-col justify-between">
      {isAdmin && (
        <button
          onClick={() => setCreateVote(true)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-3"
        >
          Create Poll
        </button>
      )}
      <div className="flex-grow overflow-auto">
        <table className="w-full border-collapse rounded-lg">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-left text-gray-600">Poll Title</th>
              <th className="p-3 text-left text-gray-600">Description</th>
              <th className="p-3 text-left text-gray-600">Options</th>
              <th className="p-3 text-left text-gray-600">Voters</th>
              <th className="p-3 text-left text-gray-600">Deadline</th>
              <th className="p-3 text-left text-gray-600">Members</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((poll, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:cursor-pointer"
                onClick={() => {
                  console.log("Poll clicked:", poll);
                  if (poll.status !== "ended") {
                    setSelectedPoll(poll)
                  }
                }}
              >
                {/* Poll Title */}
                <td className="p-3 flex flex-col">
                  <span className="font-medium">
                    {poll.title || "Untitled Poll"}
                  </span>
                </td>
                {/* Description */}
                <td className="p-3">
                  <span className="text-sm text-gray-400">
                    {poll.description || "No description"}
                  </span>
                </td>
                {/* Options */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {(poll.options || []).length}
                    </span>
                    <span className="text-sm text-gray-400">Options</span>
                  </div>
                </td>
                {/* Voters */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {poll.voters !== undefined ? poll.voters : "N/A"}
                    </span>
                    <span className="text-sm text-gray-400">Voters</span>
                  </div>
                </td>
                {/* Deadline */}
                <td className="p-3">
                  <span className="block">{formatDeadline(poll.endTime)}</span>
                </td>
                {/* Members (if applicable) */}
                <td className="p-3">
                  <div className="flex -space-x-2">
                    {(poll.members || []).length > 0 ? (
                      (poll.members || []).map((member, i) => (
                        <img
                          key={i}
                          src={member}
                          alt="Member"
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No members</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPoll && (
        <VoteModal
          isOpen={!!selectedPoll}
          closeModal={() => setSelectedPoll(null)}
          poll={selectedPoll}
        />
      )}

      {createVote && (
        <CreateVote
          isOpen={!!createVote}
          closeModal={() => setCreateVote(false)}
        />
      )}

      <div className="flex justify-end items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`text-gray-600 hover:text-black transition ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`text-gray-600 hover:text-black transition ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VotingTable;