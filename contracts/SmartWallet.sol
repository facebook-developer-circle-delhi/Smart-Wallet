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
}