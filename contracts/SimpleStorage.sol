// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint256 private value;
    address public owner;

    event ValueChanged(uint256 oldValue, uint256 newValue, address indexed changedBy);

    constructor(uint256 initialValue) {
        owner = msg.sender;
        value = initialValue;
    }

    function set(uint256 newValue) external {
        uint256 oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue, msg.sender);
    }

    function get() external view returns (uint256) {
        return value;
    }
}
