pragma solidity ^0.4.7;

contract SolarEnergy {

    mapping(address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);
    uint public excessToEther;

    function token(uint supply) {
        coinBalanceOf[msg.sender] = supply;
    }

    function SolarEnergy(uint excessEnergy) {
          //conversion mwh/ether si nécessaire
          excessToEther = excessEnergy;
          coinBalanceOf[msg.sender] += 1000000;
    }

    function sendCoin(address receiver, uint amount) returns (bool sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return false;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return true;
    }

    function sellExcessEnergyForEther(address buyer, uint amount) returns (bool sufficient) {
        if (coinBalanceOf[buyer] < amount || 0 > amount) return false;

        coinBalanceOf[buyer] -= amount;
        coinBalanceOf[msg.sender] += amount;
        CoinTransfer(buyer, msg.sender, amount);
        return true;
    }

    uint public storedDat;

    function set(uint x) {
        storedDat = x;
    }

    function get() constant returns (uint retVal) {
        uint value = coinBalanceOf[msg.sender];
        return value;
    }
}
