const { BlockChain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = EC("secp256k1");

const mykey = ec.keyFromPrivate(
  "deea06e0144c2c474352d3f1e80fbc59a0b63e526fbc7aeec891e8bc4ae42140"
);

const myWallet = mykey.getPublic("hex");

let QtaCoin = new BlockChain();

const tx1 = new Transaction(myWallet, "another wallet", 10);
tx1.signTransaction(mykey);
QtaCoin.addTransaction(tx1);

console.log("\n Start mining address....");
QtaCoin.minePendingTransactions(myWallet);
console.log("\n Balance of address is ", QtaCoin.getBalanceOfAddress(myWallet));

// console.log("mining block....0");
// QtaCoin.addlock(new Block(1, "01/01/2019", { amount: 3 }));
// console.log("mining block....1");
// QtaCoin.addlock(new Block(2, "02/09/2019", { amount: 1 }));

// QtaCoin.chain[1].data = { amount: 100};
// QtaCoin.chain[1].hash = QtaCoin.chain[1].calculateHash();
// console.log('Is blockChain valid?', QtaCoin.isChainValid());

// console.log(JSON.stringify(QtaCoin, null, 4));

// create transaction for address

// QtaCoin.createTransaction(new Transaction("fakeaddress1", "fakeaddress2", 20));
// QtaCoin.createTransaction(new Transaction("fakeaddress2", "fakeaddress1", 20));

// console.log("\n Start mining address....");
// QtaCoin.minePendingTransactions("tong-adress-1");
// console.log(
//   "\n Balance of address is ",
//   QtaCoin.getBalanceOfAddress("tong-adress-1")
// );

// //
// console.log("\n Start mining address again....");
// QtaCoin.minePendingTransactions("tong-adress-1");
// console.log(
//   "\n Balance of address is ",
//   QtaCoin.getBalanceOfAddress("tong-adress-1")
// );

lifeFunnelTracker.trackStepSubmitCallBack();

$(".show-on-thankyou")
  .prepend(content)
  .slideDown(function() {
    scrollToTop($(this));
  })
  .then(function() {
    $(".hide-on-thankyou").fadeOut(function() {
      $(this).remove();
    });
  });

$(".share-box .toggle").click();

$.OBS_popup.removePreloader();
$.OBS_popup.hide();
