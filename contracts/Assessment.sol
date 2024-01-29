// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Pen(uint256 amount);
    event Notebook(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 buyAmount);

    modifier checkAmount(uint _buyAmount) {
        if (balance < _buyAmount) {
            revert InsufficientBalance({
                balance: balance,
                buyAmount: _buyAmount
            });
        }
        _;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function pen(uint256 _buyAmount) onlyOwner checkAmount(_buyAmount) public {
        uint _previousBalance = balance;

        // withdraw the given amount
        balance -= _buyAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _buyAmount));

        // emit the event
        emit Pen(_buyAmount);
    }

    function notebook(uint256 _buyAmount) onlyOwner checkAmount(_buyAmount) public {
        uint _previousBalance = balance;
        
        // withdraw the given amount
        balance -= _buyAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _buyAmount));

        // emit the event
        emit Notebook(_buyAmount);
    }
}
