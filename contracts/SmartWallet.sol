pragma solidity 0.4.24;

contract SmartWallet {
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
    require(msg.sender == _account);
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
}