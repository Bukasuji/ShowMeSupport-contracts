//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title SupportContract
 * @dev A contract for users to show support to the contract owner by sending ETH and leaving a message of encouragement.
 */
contract SupportContract {
    
    // Address of contract owner.
    address payable public owner;

    // Struct to store support messages received.
    struct SupportMessage {
        address sender;
        uint256 timestamp;
        string name;
        string message;
    }

    // Array to store all support messages.
    SupportMessage[] public supportMessages;
    
    // These event is emited when a user show support.
    event SupportMessageCreated (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //A constructor that assigns the owner of the contract to the deployer address
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Transfer ownership of the contract from the owner to a new owner.
     * @param newOwner address of the new owner of the contract.
     */
    function transferOwnership(address payable newOwner) public {
        require(msg.sender == owner, "Only the current owner can transfer ownership.");
        require(newOwner != address(0), "Invalid new owner address.");
        owner = newOwner;
    }

    /**
     * @dev Allows users to show support to the owner by sending an ETH tip and leaving a message.
     * @param _name Name of the person showing support.
     * @param _message A message from the person showing support.
     */
    function showSupport(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "You cannot show support with 0 ETH!");
        supportMessages.push(SupportMessage(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
        // Emit a SupportMessageCreated event with details about the support message.
        emit SupportMessageCreated(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev get all stored support messages.
     * @return An array of SupportMessage representing all stored support messages.
     */
    function getAllSupportMessages() public view returns (SupportMessage[] memory) {
        return supportMessages;
    }

    /**
     * @dev Deletes all stored support messages in the array.
     */
    function clearSupportMessages() public {
        require(msg.sender == owner, "Only the contract owner can clear support messages.");
        delete supportMessages;
    }

    /**
     * @dev Sends the entire balance stored in this contract to the owner.
     */
    function ownerWithdraw() public {
        require(msg.sender == owner, "Please only the contract owner can withdraw tips.");
        require(address(this).balance > 0, "No funds available for withdrawal.");
        owner.transfer(address(this).balance);
    }
    
    /**
     * @dev Fetches the balance of the contract.
     */
    function getBalance() public view returns (uint256) {
      return address(this).balance;
    }

    
}
