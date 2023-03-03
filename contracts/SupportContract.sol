//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title SupportContract
 * @dev A contract for users to show support to the contract owner by sending an ETH tip and leaving a message.
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
    
    // Event to emit when a support message is created.
    event SupportMessageCreated (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

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
     * @return An array of SupportMessage structs representing all stored support messages.
     */
    function getAllSupportMessages() public view returns (SupportMessage[] memory) {
        return supportMessages;
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
     * @dev Fetches the total number of tips in the contract(ie the total ether received by the owner).
     */
    function getTotalTips() public view returns (uint256) {
      return address(this).balance;
    }

    //SupportContract deployed to: 0x0B9f832c6180Ff2aa451a41FFA1E38Ab7EB25962
}
