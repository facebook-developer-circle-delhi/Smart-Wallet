let smartWallet = artifacts.require("./SmartWallet.sol");

module.exports = (deployer) => {
	deployer.deploy(smartWallet);
}