const EC = require('elliptic').ec;
const ec = EC('secp256k1');
const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for orther wallet");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.once = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.once
    ).toString();
  }

  minerBlock(difficulte) {
    while (
      this.hash.substring(0, difficulte) !== Array(difficulte + 1).join("0")
    ) {
      this.once++;
      this.hash = this.calculateHash();
    }
    console.log("Miner block ....", this.hash);
  }

  hasValidTransaction() {
    for (const tx of this.transactions) {
      if(!tx.isValid()){
        return false;
      }
    }
    return true;
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createQtaBlock()];
    this.difficulte = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createQtaBlock() {
    return new Block("01/01/2019/", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // will change tp mining reward
  addlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.minerBlock(this.difficulte);
    // newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null,  miningRewardAddress, this.miningReward)
    this.pendingTransactions.push(rewardTx);

    let block = new Block(Date.now(), this.pendingTransactions);
    block.minerBlock(this.difficulte);

    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [];
  }
  
  // Add transaction
  addTransaction(transaction) {
    if(!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must inlcude from/to Address.")
    }
    if(!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(!currentBlock.hasValidTransaction()){
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
