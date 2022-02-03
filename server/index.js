const express = require('express');
const Miner = require('./src/mine');
const bodyParser = require('body-parser');
const { generateKeys, signMessage, verifyMessage } = require('./src/util');
const { balances } = require('./src/db');
const db = require('./src/db');

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

/**
 * These functions will usually exist on the client side
 * But for the purpose of this exercise, we're putting it here
 */

// message, private key
app.post('/signMessage', (req, res) => {
  // sign the message with the private key
  const { message } = req.body;

  const { from } = message;
  const private = db.balances[from].privateKey;

  const msgStr = JSON.stringify(message);
  const signed = signMessage(private, msgStr);
  res.send(signed);
});

app.post('/verifyMessage', (req, res) => {
  const { message, signature } = req.body;

  const { from, amount } = JSON.parse(message);
  const publicKey = db.balances[from].publicKey;
  const verify = verifyMessage(signature, publicKey, message);

  if(verify) {
    miner.mineVerifiiedTransaction(from, amount);
    res.send("Mined!");
  } else {
    res.send("Could not verify message");
  }
});

app.listen(PORT, () => {
  console.log('listening on port 3001!');
});

