

contract MyContract{
    // This is a mapping, similar to a key-value pair. A user's address will be linked to 
    // whether they have voted or not.
    mapping(address => bool) internal hasVoted;

    receive() external payable{}

    function checkBalance() public view returns (uint){
        return address(this).balance;
    }
}