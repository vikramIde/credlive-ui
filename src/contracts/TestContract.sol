pragma solidity ^0.4.2;

contract TestContract {
    uint public storedData = 20;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint data_) {
        data_ = storedData;
    }
}