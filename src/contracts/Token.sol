pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Token is Ownable {
    using SafeMath for uint;

    string public name;
    string public symbol;
    uint8 public decimals;

    //mapping (address => uint256) balances;
    mapping (address => Balance) _balances;
    mapping (address => mapping (address => uint256)) allowed;

    uint256 public rate = 1000;

    uint256 private _start;
    uint256 private _initalSupply;

    struct Balance {
        uint256 timestamp;
        uint256 amount;
    }

    function totalSupply() public view returns(uint256) {
        return calc(_initalSupply, _start);
    }

    constructor () public {
        symbol = "SCC";
        name = "StartCryptoCoin";
        decimals = 18;

        _start = now;
        _initalSupply = 1000000000;
        _balances[msg.sender] = Balance(_start, _initalSupply);
    }

    function balanceOf(address who) public view returns (uint256) {
        return _getBalance(who);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(_getBalance(msg.sender) >= value, "Insufficient balance");

        //uint256 _amount = _getBalance(msg.sender);

        _balances[msg.sender].timestamp = now;
        _balances[msg.sender].amount = _getBalance(msg.sender).sub(value);

        //balances[to] = balances[to].add(value);

        _balances[to].timestamp = now;
        _balances[to].amount = _getBalance(msg.sender).add(value);

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(_getBalance(from) >= value && allowed[from][msg.sender] >= value && _getBalance(to) + value >= _getBalance(to), "Insufficient balance");

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

    function calc(uint256 amount, uint256 start) private view returns (uint256) {
        uint256 deltaTime = now.sub(start);
        return amount.mul(1 + rate * deltaTime);
    }

    function _getBalance(address who) private view returns(uint256) {
        return calc(_balances[who].timestamp, _balances[who].amount);
    } 

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}
