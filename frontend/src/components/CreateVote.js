import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { createPoll, getPolls } from "../api/polls"; // Imported getPolls for listing polls
import { useNavigate } from "react-router-dom";
import logo from "../assets/VoteChain.png";

const CreateVote = ({ isOpen, closeModal }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [expiryTime, setExpiryTime] = useState("");
    const [candidates, setCandidates] = useState([
        { id: 1, name: "", image: null },
    ]);
    const [polls, setPolls] = useState([]); // NEW: State variable to store polls

    const candidatesPerColumn = 8;
    const numColumns = Math.ceil(candidates.length / candidatesPerColumn);

    // Split candidates into columns dynamically
    const candidateColumns = Array.from({ length: numColumns }, (_, colIndex) =>
        candidates.slice(
            colIndex * candidatesPerColumn,
            (colIndex + 1) * candidatesPerColumn
        )
    );

    // Set Dialog Panel Width Based on Column Count
    const dialogWidthClass =
        numColumns === 1
            ? "max-w-md"
            : numColumns === 2
            ? "max-w-lg"
            : "max-w-2xl";

    // Add a new candidate row
    const addCandidate = () => {
        if (candidates.length < 24) {
            setCandidates([
                ...candidates,
                { id: candidates.length + 1, name: "", image: null },
            ]);
        }
    };

    // Remove a candidate row
    const removeCandidate = (id) => {
        setCandidates(candidates.filter((candidate) => candidate.id !== id));
    };

    // Handle candidate name change
    const handleCandidateChange = (id, newName) => {
        setCandidates(
            candidates.map((candidate) =>
                candidate.id === id
                    ? { ...candidate, name: newName }
                    : candidate
            )
        );
    };

    // Handle image upload
    const handleImageUpload = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCandidates(
                    candidates.map((candidate) =>
                        candidate.id === id
                            ? { ...candidate, image: reader.result }
                            : candidate
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };

    // NEW: Function to fetch polls from the backend and update state
    const fetchPolls = async () => {
        try {
            const data = await getPolls();
            setPolls(data.polls); // Assume response returns { polls: [...] }
        } catch (error) {
            console.error("Error fetching polls:", error);
        }
    };

    // NEW: useEffect to load polls when the component mounts
    useEffect(() => {
        fetchPolls();
    }, []);

    const handleCreateVote = async () => {
        if (!title || !description || !expiryDate || !expiryTime) {
            alert("Please fill in all required fields.");
            return;
        }

        const startISO = new Date().toISOString();
    
        // Combine expiryDate and expiryTime into an ISO-formatted string.
        // Adjust this logic if your backend expects different fields (e.g., separate startTime and endTime)
        const expiryLocal = new Date(`${expiryDate}T${expiryTime}`);
        const expiryISO = expiryLocal.toISOString();
    
        // Construct newPollData with all required fields.
        // Map the candidates to match the expected "options" structure.
        const newPollData = {
            title,
            description,
            startTime: startISO,
            endTime: expiryISO, // For now, using the same value for both. Adjust if needed.
            options: candidates.map((candidate) => ({
                optionId: candidate.id.toString(), // Convert id to string
                label: candidate.name,
                image: candidate.image,
            })),
            status: "active", // Default value
            createdBy: "000000000000000000000000", // Dummy value for testing
        };
    
        try {
            // Call the createPoll API helper with the newPollData
            const response = await createPoll(newPollData);
            console.log("Poll successfully created:", response);
    
            // Refresh the list of polls if needed (if getPolls is used to update UI)
            await getPolls();
    
            // Optionally reset the form fields after successful creation
            setTitle("");
            setDescription("");
            setExpiryDate("");
            setExpiryTime("");
            setCandidates([{ id: 1, name: "", image: null }]);
    
            // Close the modal after successful creation
            closeModal();
        } catch (error) {
            console.error("Error during poll creation:", error);
            alert("Error creating poll. Please try again.");
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
                            {/* Poll Title & Description */}
                            <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-800">
                                Create New Poll
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                                Set up a new poll by filling in the details.
                            </p>

                            <div className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Poll Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <textarea
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Poll Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />

                                {/* Expiry Date & Time */}
                                <div className="flex space-x-4">
                                    <input
                                        type="date"
                                        className="w-1/2 p-3 border rounded-lg"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="time"
                                        className="w-1/2 p-3 border rounded-lg"
                                        value={expiryTime}
                                        onChange={(e) => setExpiryTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Candidates Section */}
                            <div
                                className="mt-6 grid gap-4"
                                style={{
                                    maxHeight: candidates.length > 3 ? "250px" : "auto",
                                    overflowY: candidates.length > 3 ? "auto" : "visible",
                                }}
                            >
                                {candidateColumns.map((column, colIndex) => (
                                    <div key={colIndex} className="space-y-3">
                                        {column.map((candidate) => (
                                            <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                                {/* Candidate Image Upload */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(candidate.id, e)}
                                                    className="hidden"
                                                    id={`upload-${candidate.id}`}
                                                />
                                                <label htmlFor={`upload-${candidate.id}`} className="cursor-pointer">
                                                    <img
                                                        src={candidate.image || "/placeholder.png"}
                                                        alt="Candidate"
                                                        className="w-10 h-10 rounded-full border-2"
                                                    />
                                                </label>
                                                {/* Candidate Name Input */}
                                                <input
                                                    type="text"
                                                    className="flex-grow border p-2 rounded-lg"
                                                    placeholder="Candidate Name"
                                                    value={candidate.name}
                                                    onChange={(e) => handleCandidateChange(candidate.id, e.target.value)}
                                                />
                                                {/* Remove Candidate Button */}
                                                {candidates.length > 1 && (
                                                    <button
                                                        onClick={() => removeCandidate(candidate.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ✖
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-between">
                                <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                                    Cancel
                                </button>
                                <button onClick={addCandidate} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                                    + Add Candidate
                                </button>
                                <button onClick={handleCreateVote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Create Poll
                                </button>
                            </div>

                            {/* Display Existing Polls */}
                            {/* <div className="mt-6">
                                <h4 className="text-lg font-semibold">Existing Polls</h4>
                                {polls.length === 0 ? (
                                    <p>No polls found.</p>
                                ) : (
                                    <ul>
                                        {polls.map((poll) => (
                                            <li key={poll.id} className="border p-2 rounded-lg my-2">
                                                <strong>{poll.title}</strong> - {poll.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div> */}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateVote;