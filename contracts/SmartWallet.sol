pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract SmartWallet {
  using SafeMath for uint;
  address public owner = msg.sender;
  
	// I am assuming there wouldn't be more than 20 wallets.
	// ToDo: Dynamic Array
  uint[20] percentageShare;
  address[20] walletAddress;
  uint totalWallets;

  // This event triggers when this smart contract will transfer 
  // amount to the wallets configured.
  event Deposited(address indexed _to, uint _percent, uint _amount, uint _total);

  // This event triggers if the configuration fails.
  event configurationFailure(string msg);

  // This event triggers if the configuration succeeds.
  event configurationSuccessful(string msg);

  // Restrict few method calls to only the
  // owner of this smart contract.
  modifier onlyBy(address _account) {
    require(msg.sender == _account, "Owner Account Required");
    _;
  }

  // Method to configure this wallet
  function configureShare(uint _totalWallets, uint[] _percents, address[] _walletAddress) public onlyBy(owner) {
    totalWallets = _totalWallets;

    for (uint j = 0; j < totalWallets; j++) {
      percentageShare[j] = _percents[j];
      walletAddress[j] = _walletAddress[j];
    }

    if (!checkPercentArray(percentageShare)) {
      emit configurationFailure("Total percentage count is not 100.");
      revert("Total percentage count is not 100.");
    }

    emit configurationSuccessful("Configuration Successful");
  }

  // Method to check whether the total percentage doesn't exceed 100
  function checkPercentArray(uint[20] _percent) private view returns(bool) {
    uint checkPercent = 0;
    
    for (uint i = 0; i < totalWallets; i++) {
      checkPercent += _percent[i];
    }

    if (checkPercent != 100) {
      return false;
    } else {
      return true;
    }
  }

  // Method to retrieve the configuration
  function getConfiguration() public view onlyBy(owner) returns(uint[20], address[20], uint) {
    return (percentageShare, walletAddress, totalWallets);
  }

  // Method to receive the amount and immediately transfer
  // it to the wallets configured based on the percentage.
  function() public payable {
    require(totalWallets != 0, "Smart Wallet Not Configured");
    uint amount = msg.value;

    for (uint i = 0; i < totalWallets; i++) {
      emit Deposited(walletAddress[i], percentageShare[i], amount.mul(percentageShare[i]).div(100), amount);
      walletAddress[i].transfer(amount.mul(percentageShare[i]).div(100));
    }
  }

  // Method to check if a wallet address was passed
  function isContractAddress(address _addr) public view returns (bool isContract) {
    uint32 size;
    /* solium-disable-next-line */
    assembly {
      size := extcodesize(_addr)
    }
    return (size > 0);
  }
}