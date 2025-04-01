// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Poll {
        string question;
        string[] options;
        uint[] votes;
        bool exists;
    }
    
    uint public pollCount;
    // Use internal mapping to avoid auto-generated getters that may cause issues.
    mapping(uint => Poll) internal polls;
    
    event Debug(string message);
    event ContractDeployed();  
    event PollCreated(uint pollId, string question);
    event Voted(uint pollId, uint optionIndex, uint newVoteCount);
    
    // Constructor with debug events to trace deployment
    constructor() {
        emit Debug("Constructor: deployment started");
        // No additional initialization
        emit Debug("Constructor: deployment finished");
        emit ContractDeployed();
    }
    
    // Create a poll with a question and list of options
    function createPoll(string memory _question, string[] memory _options) public {
        emit Debug("createPoll: started");
        require(_options.length >= 2, "Error: At least two options are required to create a poll");
        pollCount++;
        
        // Assign values directly in the mapping
        polls[pollCount].question = _question;
        polls[pollCount].exists = true;
        
        // Push each option and initialize its vote count to 0
        for (uint i = 0; i < _options.length; i++) {
            polls[pollCount].options.push(_options[i]);
            polls[pollCount].votes.push(0);
        }
        
        emit PollCreated(pollCount, _question);
        emit Debug("createPoll: finished");
    }
    
    // Vote for an option in a poll
    function vote(uint _pollId, uint _optionIndex) public {
        emit Debug("vote: started");
        require(polls[_pollId].exists, "Error: The specified poll does not exist");
        require(_optionIndex < polls[_pollId].options.length, "Error: The option index is invalid");
        
        polls[_pollId].votes[_optionIndex]++;
        emit Voted(_pollId, _optionIndex, polls[_pollId].votes[_optionIndex]);
        emit Debug("vote: finished");
    }
    
    // Custom getter for the poll's question
    function getPollQuestion(uint _pollId) public view returns (string memory) {
        require(polls[_pollId].exists, "Error: Poll does not exist");
        return polls[_pollId].question;
    }
    
    // Custom getter for the poll's options
    function getPollOptions(uint _pollId) public view returns (string[] memory) {
        require(polls[_pollId].exists, "Error: Poll does not exist");
        return polls[_pollId].options;
    }
    
    // Custom getter for the poll's votes
    function getPollVotes(uint _pollId) public view returns (uint[] memory) {
        require(polls[_pollId].exists, "Error: Poll does not exist");
        return polls[_pollId].votes;
    }
}