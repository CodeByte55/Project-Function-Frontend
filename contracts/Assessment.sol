// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    string public message;
    uint256 public count;

    // Constructor to initialize the contract
    constructor(string memory initialMessage) {
        message = initialMessage;
        count = 0;
    }

    // Function to update the message
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    // Function to increment the counter
    function incrementCounter() public {
        count++;
    }

    // Function to get the current counter value (optional, as `count` is public)
    function getCount() public view returns (uint256) {
        return count;
    }
}
