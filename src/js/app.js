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
    return App.initContract();
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
  
  initContract: () => {
    $.getJSON('SmartWallet.json', (smartWalletArtifact) => {
      App.contracts.SmartWallet = TruffleContract(smartWalletArtifact);
      App.contracts.SmartWallet.setProvider(App.web3Provider);
      return App.getConfiguration();
    })
  },
  
  getConfiguration: async () => {
    App.contracts.SmartWallet.deployed()
      .then((instance) => {
        return instance.getConfiguration({from : App.account, gas: 500000});
      })
      .then((data) => {
        let wallets = data[2].toNumber();
        if (wallets !== 0) {
          let percent = data[0];
          let address = data[1];

          for (let i = 0; i < wallets; i++) {
            $("#configTable > tbody")
              .append("<tr><td>"+data[1][i]+"</td><td>"+data[0][i]+"%</td></tr>");
          }

          $("#config").show();
        } else {
          $("#config").hide();
        }
        
      });
  },
  
  addWallet: () => {
    var num = $("#wallets > div").length/2;
    $('#wallets').append('<div class="form-group"><label for="w'+num+'">Wallet address</label> <input type="text" class="form-control" id="w'+num+'" name="walletAddress[]" placeholder="Enter the ethereum wallet address"></div> &nbsp; <div class="form-group"><label for="p'+num+'">Wallet share(%)</label> <input type="number" class="form-control" id="p'+num+'" placeholder="Enter the percent share" max="100" pattern="[0-9]+([\.,][0-9]+)?" step="5"></div> <hr>');
  },

  removeWallet: () => {
    var num = $("#wallets > div").length;
    if (num > 3) {
      $('#wallets > div').slice(-2).remove();
    } else {
      return false;
    }
  },

};

$(() => {
  $(window).load(() => {
    App.init();
  });
});