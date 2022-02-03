const sha256 = require('crypto-js/sha256');

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
  }
  
  addTransaction(tx) {
    this.transactions.push(tx);
  }

  hash() {
    return sha256(
      this.timestamp + "" + 
      this.nonce + "" +
      JSON.stringify(this.transactions)
    ).toString();
  }

  // dummy data to check if transaction has been verified
  // technically they all should be
  execute(verified=false) {
    this.transactions.forEach(trx => trx.execute(verified));
  }
}

module.exports = Block;