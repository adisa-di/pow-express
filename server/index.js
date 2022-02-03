const express = require('express');
const Miner = require('./src/mine');
const bodyParser = require('body-parser');
const { generateKeys } = require('./src/util');
const { balances } = require('./src/db');

const app = express();
const miner = new Miner(1500); // 500 ms

const PORT = 3001;

app.use(bodyParser.json());

app.get('/start', (req, res) => {
  miner.start();
  res.send('started mining');
});

app.get('/stop', (req, res) => {
  miner.stop();
  res.send('stopped mining');
});

// generates public addresses and amounts
app.get('/generate/:amount', (req, res) => {
  const {amount} = req.params;
  generateKeys(balances, amount);

  const addressAndBalances = [];
  for (let key in balances) {
    addressAndBalances.push({address: key, balance: balances[key].balance});
  }

  let accountInfos = `\n--------Accounts---------\n`;
  addressAndBalances.forEach(add => accountInfos +=  `Account: ${add.address}, Balance: ${add.balance}\n`);

  res.send(accountInfos);
});

app.post('/transaction', (req, res) => {

  // const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  // const coninbaseTrnx = new Transaction([], [coinbaseUTXO]);

  // what do we need 
  // owner address
  // amount
  // to create a new utxo

});

app.listen(PORT, () => {
  console.log('listening on port 3001!');
});

