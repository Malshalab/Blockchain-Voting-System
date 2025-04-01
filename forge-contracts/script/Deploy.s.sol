// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../src/DecentralizedVoting.sol";  // adjust path if needed

contract Deploy {
    function run() external returns (DecentralizedVoting) {
        DecentralizedVoting voting = new DecentralizedVoting();
        return voting;
    }
}
