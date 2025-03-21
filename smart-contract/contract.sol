// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    address public admin;
    uint256 public pollCount;

    struct Candidate {
        uint256 id; // Unique identifier for the candidate
        string name; // Candidate's name
        uint256 voteCount; // Number of votes received
    }

    struct Poll {
        uint256 id; // Unique identifier for the poll
        string title; // Title of the poll
        uint256 startTime; // Poll start timestamp
        uint256 endTime; // Poll end timestamp
        bool active; // Status of the poll (active/inactive)
        mapping(uint256 => Candidate) candidates; // Mapping of candidate ID to Candidate struct
        uint256 candidateCount; // Number of candidates in the poll
        mapping(address => bool) hasVoted; // Tracks if a voter has cast their vote
    }

    mapping(uint256 => Poll) public polls;
    mapping(bytes32 => bool) public registeredVoters; // Stores hashed voter IDs

    event PollCreated(uint256 pollId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 pollId, uint256 candidateId, string name);
    event Voted(uint256 pollId, uint256 candidateId, address voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier validPoll(uint256 pollId) {
        require(polls[pollId].id != 0, "Poll does not exist.");
        require(block.timestamp >= polls[pollId].startTime, "Poll has not started yet.");
        require(block.timestamp <= polls[pollId].endTime, "Poll has ended.");
        require(polls[pollId].active, "Poll is not active.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Registers a voter using a cryptographic hash of their ID
     * @param voterHash bytes32 - Hashed identifier of the voter
     */
    function registerVoter(bytes32 voterHash) public onlyAdmin {
        require(!registeredVoters[voterHash], "Voter already registered.");
        registeredVoters[voterHash] = true;
    }

    /**
     * @notice Creates a new poll with the given title and time constraints
     * @param title string - The title of the poll
     * @param startTime uint256 - The timestamp when the poll starts
     * @param endTime uint256 - The timestamp when the poll ends
     */
    function createPoll(string memory title, uint256 startTime, uint256 endTime) public onlyAdmin {
        require(startTime < endTime, "Invalid time range.");
        pollCount++;

        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.title = title;
        newPoll.startTime = startTime;
        newPoll.endTime = endTime;
        newPoll.active = true;
        newPoll.candidateCount = 0;

        emit PollCreated(pollCount, title, startTime, endTime);
    }

    /**
     * @notice Adds a candidate to an existing poll
     * @param pollId uint256 - ID of the poll
     * @param name string - Name of the candidate
     */
    function addCandidate(uint256 pollId, string memory name) public onlyAdmin validPoll(pollId) {
        Poll storage poll = polls[pollId];
        poll.candidateCount++;
        poll.candidates[poll.candidateCount] = Candidate(poll.candidateCount, name, 0);
        emit CandidateAdded(pollId, poll.candidateCount, name);
    }

    /**
     * @notice Allows a registered voter to cast a vote
     * @param pollId uint256 - ID of the poll
     * @param candidateId uint256 - ID of the candidate being voted for
     * @param voterHash bytes32 - Hashed voter ID for verification
     */
    function vote(uint256 pollId, uint256 candidateId, bytes32 voterHash) public validPoll(pollId) {
        require(registeredVoters[voterHash], "Voter is not registered.");
        require(!polls[pollId].hasVoted[msg.sender], "You have already voted.");

        Poll storage poll = polls[pollId];
        require(candidateId > 0 && candidateId <= poll.candidateCount, "Invalid candidate.");

        poll.candidates[candidateId].voteCount++;
        poll.hasVoted[msg.sender] = true;

        emit Voted(pollId, candidateId, msg.sender);
    }

    /**
     * @notice Retrieves the results of a poll
     * @param pollId uint256 - ID of the poll
     * @return title string - The title of the poll
     * @return candidateIds uint256[] - Array of candidate IDs
     * @return voteCounts uint256[] - Array of vote counts for each candidate
     */
    function getPollResults(uint256 pollId) public view returns (string memory, uint256[] memory, uint256[] memory) {
        require(polls[pollId].id != 0, "Poll does not exist.");

        Poll storage poll = polls[pollId];
        uint256 numCandidates = poll.candidateCount;

        string memory title = poll.title;
        uint256[] memory candidateIds = new uint256[](numCandidates);
        uint256[] memory voteCounts = new uint256[](numCandidates);

        for (uint256 i = 1; i <= numCandidates; i++) {
            candidateIds[i - 1] = poll.candidates[i].id;
            voteCounts[i - 1] = poll.candidates[i].voteCount;
        }

        return (title, candidateIds, voteCounts);
    }

    /**
     * @notice Deactivates a poll to prevent further voting
     * @param pollId uint256 - ID of the poll
     */
    function deactivatePoll(uint256 pollId) public onlyAdmin {
        require(polls[pollId].id != 0, "Poll does not exist.");
        polls[pollId].active = false;
    }
}