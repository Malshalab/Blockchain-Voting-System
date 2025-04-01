// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    address public admin;
    uint256 public pollCount;
    uint256 public voteFee = 0.001 ether;

    struct Candidate {
        uint256 id;            // Candidate ID
        string name;           // Candidate name
        uint256 voteCount;     // Total votes received
    }

    struct Poll {
        uint256 id;                            // Poll ID
        string title;                          // Poll title
        uint256 startTime;                     // Start timestamp
        uint256 endTime;                       // End timestamp
        bool active;                           // Poll status
        mapping(uint256 => Candidate) candidates; // Mapping of candidate ID to candidate
        uint256 candidateCount;                // Number of candidates
        mapping(address => bool) hasVoted;     // Voter participation tracking
    }

    mapping(uint256 => Poll) public polls;
    mapping(bytes32 => bool) public registeredVoters; // Registered voters by hashed ID
    mapping(address => bool) public isValidator;      // Validator status mapping

    event PollCreated(uint256 pollId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 pollId, uint256 candidateId, string name);
    event Voted(uint256 pollId, uint256 candidateId, address voter);
    event ValidatorAdded(address validator);
    event ValidatorRemoved(address validator);
    event VoteFundsAllocated(address voter, address validator);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender], "Only validators can perform this action.");
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
     * @notice Adds a validator
     * @param validator address - Ethereum address to mark as validator
     */
    function addValidator(address validator) public onlyAdmin {
        isValidator[validator] = true;
        emit ValidatorAdded(validator);
    }

    /**
     * @notice Removes a validator
     * @param validator address - Ethereum address to remove from validator list
     */
    function removeValidator(address validator) public onlyAdmin {
        isValidator[validator] = false;
        emit ValidatorRemoved(validator);
    }

    /**
     * @notice Allocates vote fee funds to a voter
     * @param voter address - Ethereum address of the voter
     */
    function allocateVoteFunds(address voter) public onlyValidator {
        require(address(this).balance >= voteFee, "Insufficient contract balance");
        payable(voter).transfer(voteFee);
        emit VoteFundsAllocated(voter, msg.sender);
    }

    /**
     * @notice Registers a voter by hashed ID
     * @param voterHash bytes32 - Hashed voter ID
     */
    function registerVoter(bytes32 voterHash) public onlyAdmin {
        require(!registeredVoters[voterHash], "Voter already registered.");
        registeredVoters[voterHash] = true;
    }

    /**
     * @notice Creates a new poll
     * @param title string - Poll name/title
     * @param startTime uint256 - Start time as Unix timestamp
     * @param endTime uint256 - End time as Unix timestamp
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
     * @notice Adds a candidate to a poll
     * @param pollId uint256 - Poll ID to add candidate to
     * @param name string - Candidate name
     */
    function addCandidate(uint256 pollId, string memory name) public onlyAdmin validPoll(pollId) {
        Poll storage poll = polls[pollId];
        poll.candidateCount++;
        poll.candidates[poll.candidateCount] = Candidate(poll.candidateCount, name, 0);
        emit CandidateAdded(pollId, poll.candidateCount, name);
    }

    /**
     * @notice Allows a registered voter to vote
     * @param pollId uint256 - ID of the poll
     * @param candidateId uint256 - ID of the candidate being voted for
     * @param voterHash bytes32 - Hashed voter ID
     */
    function vote(uint256 pollId, uint256 candidateId, bytes32 voterHash) public payable validPoll(pollId) {
        require(registeredVoters[voterHash], "Voter is not registered.");
        require(!polls[pollId].hasVoted[msg.sender], "You have already voted.");
        require(msg.value == voteFee, "Incorrect vote fee amount.");

        Poll storage poll = polls[pollId];
        require(candidateId > 0 && candidateId <= poll.candidateCount, "Invalid candidate.");

        poll.candidates[candidateId].voteCount++;
        poll.hasVoted[msg.sender] = true;

        payable(msg.sender).transfer(msg.value); // Refund the voter

        emit Voted(pollId, candidateId, msg.sender);
    }

    /**
     * @notice Returns poll results
     * @param pollId uint256 - ID of the poll
     * @return title string - Poll title
     * @return candidateIds uint256[] - List of candidate IDs
     * @return voteCounts uint256[] - Corresponding vote counts
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
     * @notice Deactivates a poll
     * @param pollId uint256 - ID of the poll
     */
    function deactivatePoll(uint256 pollId) public onlyAdmin {
        require(polls[pollId].id != 0, "Poll does not exist.");
        polls[pollId].active = false;
    }

    function getPollSummary(uint256 pollId) public view returns (
        string memory title,
        uint256 startTime,
        uint256 endTime,
        bool active,
        uint256 candidateCount
    ) {
        Poll storage poll = polls[pollId];
        return (
            poll.title,
            poll.startTime,
            poll.endTime,
            poll.active,
            poll.candidateCount
        );
    }


    // Fallback to receive ether for funding vote allocations
    receive() external payable {}
}
