pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Token is Ownable {
    using SafeMath for uint;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowed;

    constructor () public {
        symbol = "SCC";
        name = "StartCryptoCoin";
        decimals = 18;
        totalSupply = 1000000000;

        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balances[msg.sender] >= value, "Insufficient funds");

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(msg.sender, to, value);

        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");

        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0), "Invalid address");

        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function () external payable {
        revert("Not payable");
    }
}