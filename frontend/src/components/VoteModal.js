import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { chunk } from "lodash";
import { voteOnPollBackend } from "../api/polls"; // Ensure this path is correct

const VoteModal = ({ isOpen, closeModal, poll }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const candidatesPerColumn = 8;
  const candidateColumns = chunk(poll.options, candidatesPerColumn);
  const [numColumns, setNumColumns] = useState(1);

  useEffect(() => {
    setNumColumns(Math.min(3, Math.ceil(poll.options.length / 8)));
  }, [poll]);

  const gridClass =
    numColumns === 1 ? "grid-cols-1" :
    numColumns === 2 ? "grid-cols-2" : "grid-cols-3";

  const dialogWidthClass =
    numColumns === 1 ? "max-w-md" :
    numColumns === 2 ? "max-w-lg" : "max-w-2xl";

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate!");
      return;
    }
    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }
      // Call the backend vote endpoint. Assume poll.id exists and candidate has an id.
      const result = await voteOnPollBackend(poll.id, selectedCandidate.id, token);
      console.log("Vote successfully cast:", result);
      alert("Vote successfully cast!");
      closeModal();
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Error casting vote. Please try again.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={`w-full ${dialogWidthClass} bg-white rounded-lg shadow-xl p-6`}>
              {/* Poll Title */}
              <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-800">
                {poll.title}
              </Dialog.Title>
              <p className="text-sm text-gray-500">{poll.description}</p>
              {/* Candidate List */}
              <div className={`mt-4 grid ${gridClass} gap-4`}>
                {candidateColumns.map((column, colIndex) => (
                  <div key={colIndex} className="space-y-3">
                    {column.map((candidate) => (
                      <button
                        key={candidate.id}
                        className={`flex items-center w-full p-3 rounded-lg border ${
                          selectedCandidate && selectedCandidate.id === candidate.id
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        } hover:bg-gray-100 transition`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <img
                          src={candidate.image || "/placeholder.png"}
                          alt={candidate.label}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <span className="text-gray-800">{candidate.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                  Cancel
                </button>
                <button onClick={handleVote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Submit Vote
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VoteModal;