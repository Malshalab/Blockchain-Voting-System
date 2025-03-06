import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VotingTable = ({ title, data, isActive }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePollClick = (pollId) => {
        navigate(`/poll/${pollId}`);
    };

    return (
        <div className="bg-white shadow-lg rounded-b-lg rounded-r-lg p-6 h-full flex flex-col justify-between">
                {/* Set Fixed Height */}
                <div className="flex-grow  overflow-auto">
                    <table className="w-full border-collapse rounded-lg">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="p-3 text-left text-gray-600">Poll Name</th>
                                <th className="p-3 text-left text-gray-600">Candidates</th>
                                <th className="p-3 text-left text-gray-600">Voters</th>
                                <th className="p-3 text-left text-gray-600">Status</th>
                                <th className="p-3 text-left text-gray-600">Deadline</th>
                                <th className="p-3 text-left text-gray-600">Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((vote, index) => (
                                <tr key={index} className="border-b last:border-none hover:cursor-pointer" onClick={() => handlePollClick(vote.id)}>
                                    <td className="p-3 flex flex-col">
                                        <span className="font-medium">{vote.name}</span>
                                        <span className="text-xs text-gray-400">{vote.address}</span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{vote.candidates}</span>
                                            <span className="text-sm text-gray-400">Candidates</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{vote.voters}</span>
                                            <span className="text-sm text-gray-400">Voters</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        {isActive ? (
                                            <span className="text-green-600 font-medium">✅ Valid</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">❌ Not Valid</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className="block">{vote.time}</span>
                                        <span className="text-xs text-gray-400">{vote.date}</span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex -space-x-2">
                                            {vote.members.map((member, i) => (
                                                <img key={i} src={member} alt="Member" className="w-8 h-8 rounded-full border-2 border-white" />
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            <div className="flex justify-end items-center">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`text-gray-600 hover:text-black transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium mx-4">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`text-gray-600 hover:text-black transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default VotingTable;
