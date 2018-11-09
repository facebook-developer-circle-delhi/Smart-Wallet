App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: () => {
    return App.initWeb3();
  },

  initWeb3: () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    
    web3 = new Web3(App.web3Provider);
    App.displayAccountInfo();
  },
  
  displayAccountInfo: () => {
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, (err, balance) => {
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + "ETH");
          }
        })
      }
    })
  },

};

$(() => {
  $(window).load(() => {
    App.init();
  });
});