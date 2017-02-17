pragma solidity ^0.4.7;

contract SolarEnergy {

    mapping(address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);
    uint currentmwh;
    uint threshold;
    uint public excess;

    function token(uint supply) {
        coinBalanceOf[msg.sender] = supply;
    }

    function SolarEnergy(uint init) {
        //conversion mwh/ether si nécessaire
        excess = currentmwh - threshold;
        coinBalanceOf[msg.sender] += 1000;
    }

    function sellExcessEnergyForEther(address buyer) returns (bool) {
        if (coinBalanceOf[buyer] < excess || 0 > excess) return false;
        if (excess < 1) return false;
        excess = currentmwh - threshold;
        coinBalanceOf[buyer] -= excess;
        coinBalanceOf[msg.sender] += excess;
        CoinTransfer(buyer, msg.sender, excess);
        return true;
    }

    function set(uint current, uint thresh) {
        currentmwh = current;
        threshold = thresh;
    }

    function get() constant returns (uint retVal) {
        uint value = coinBalanceOf[msg.sender];
        return value;
    }
}
