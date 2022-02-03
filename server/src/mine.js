const Block = require('./models/Block');
const Blockchain = require('./models/Blockchain');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const { PUBLIC_KEY } = require('./config');
const db = require('./db');
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;

class Miner {
  constructor(interval) {
    this.mining = false;
    this.interval = interval;
    this.chain = new Blockchain();
  }

  start() {
    this.mining = true;
    this.mine();
  }

  stop() {
    this.mining = false;
  }

  // executes mining of a verified transaction
  mineVerifiiedTransaction(from, amount) {

    // create a new transaction from the utxo
    let block = new Block();
    const utxo = new UTXO(from, amount);
    const coinbaseTrnx = new Transaction([], [utxo]);
    
    block.addTransaction(coinbaseTrnx);

     // proof of work
     while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
      block.nonce++;
    }

    block.execute(true);
  }

  mine() {
    if (!this.mining) return;
    // find hash below target difficulty 
    let block = new Block();

    const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
    const coinbaseTrnx = new Transaction([], [coinbaseUTXO]);

    block.addTransaction(coinbaseTrnx);

    // proof of work
    while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
      block.nonce++;
    }

    block.execute();
    db.chain.addBlock(block);
    console.log(db.chain.blockHeight() + ` with hash of ${block.hash()} `);
  
    // heartbeat
    setTimeout(() => {
      this.mine();
    }, this.interval);
  }
}


module.exports = Miner;