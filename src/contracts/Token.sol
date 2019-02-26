pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Token is Ownable {
    using SafeMath for uint;

    string public name = "StartCryptoCoin";
    string public symbol = "SCC";
    uint8 public decimals = 4;

    mapping (address => Balance) _balances;
    mapping (address => mapping (address => uint256)) allowed;

    //0.12 * 10 ** 4 (decimals)
    //uint256 public rate = 1200; //12% pa
    uint256 public rate = 16; //per day
    uint255 private _min = 100000 * 10 ** decimals;
    

    uint256 public _start;
    uint256 private _ownerBalance;
    uint256 private _nonOwners;

    struct Balance {
        uint256 timestamp;
        uint256 amount;
    }

    function totalSupply() public view returns(uint256) {
        uint256 accruedTotal = calc(_nonOwners, _start);
        return _ownerBalance.add(accruedTotal);
    }

    constructor () public {
        _start = now;
        _ownerBalance = 1000000000 * uint256(10) ** decimals;
    }

    function balanceOf(address who) public view returns (uint256) {
        if (who == owner) {
            return _ownerBalance;
        } else {
            return _getBalance(who);
        }
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(_getBalance(msg.sender) >= value, "Insufficient balance");

        if (msg.sender == owner) {
            _ownerBalance = _ownerBalance.sub(value);
        } else {
            _balances[msg.sender].timestamp = now;
            _balances[msg.sender].amount = _getBalance(msg.sender).sub(value);
        }

        if (to == owner) {
            _ownerBalance = _ownerBalance.add(value);
        } else {
            _balances[to].timestamp = now;
            _balances[to].amount = _getBalance(msg.sender).add(value);
        }

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(_getBalance(from) >= value, "Insufficient balance");
        require(_getBalance(to).add(value) >= _getBalance(to), "Insufficient balance");
        require(allowed[from][msg.sender] >= value, "Insufficient balance");
        
        _balances[from].timestamp = now;
        _balances[from].amount = _getBalance(from).sub(value);

        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);

        _balances[to].timestamp = now;
        _balances[to].amount = _getBalance(to).add(value);

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Invalid address");

        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function delta(uint256 from) public view returns (uint256) {
        return now.sub(from);
    }

    function calc(uint256 amount, uint256 _days) public view returns (uint256) {
        //5% per 30days = 0.0016
        return amount.mul(rate * _days);
    }

    function _getBalance(address who) private view returns(uint256) {
        if (who == owner) {
            return _ownerBalance;
        } else {
            uint256 _delta = delta(_balances[who].timestamp);
            _delta = _delta.div(24 * 60 * 60);

            return calc(_balances[who].amount, _delta);
        }
    } 

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}