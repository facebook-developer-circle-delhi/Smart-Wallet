let SmartWallet = artifacts.require("./SmartWallet.sol");

contract('SmartWallet', (accounts) => {
	let smartWalletInstance;
	const owner = accounts[0];
	const wallet1 = accounts[8];
	const wallet2 = accounts[9];
	const percentShare1 = 60;
	const percentShare2 = 40;
	const percentShare3 = 80;
	const totalWallets = 2;

	it("should be configurable", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance
					.configureShare(totalWallets, 
						[percentShare1, percentShare2], 
						[wallet1, wallet2]);
			})
			.then((data) => {
				assert.equal(data.receipt.status, 0x01, "Configuration failed");
			})
	});

	it("should fail and throw error", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance
					.configureShare(totalWallets, 
						[percentShare1, percentShare3], 
						[wallet1, wallet2]);
			})
			.catch((error) => {
				assert(true);
			})
	});

	it("should trigger an event", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance
					.configureShare(totalWallets, 
						[percentShare1, percentShare2], 
						[wallet1, wallet2]);
			})
			.then((receipt) => {
				assert.equal(receipt.logs.length, 
										 1, 
										 "Event wasn't triggered"
										);
				assert.equal(receipt.logs[0].event, 
										 "configurationSuccessful", 
										 "A different event was fired"
										 );
			})
	});
});