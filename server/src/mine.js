const Block = require('./models/Block');
const Blockchain = require('./models/Blockchain');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
// const { PUBLIC_KEY } = require('./config');
// const db = require('./db');
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

  mine() {
    if (!this.mining) return;
    // find hash below target difficulty 
    let block = new Block();

    // TODO: add transactions from the mempool
    const coinbaseUTXO = new UTXO("test_admin", BLOCK_REWARD);
    const coninbaseTrnx = new Transaction([], [coinbaseUTXO]);

    block.addTransaction(coninbaseTrnx);

    // proof of work
    while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
      block.nonce++;
    }

    block.execute();
    this.chain.addBlock(block);
    console.log(this.chain.blockHeight() + ` with hash of ${block.hash()} `);

    // heartbeat
    setTimeout(() => {
      this.mine();
    }, this.interval);
  }
}


module.exports = Miner;