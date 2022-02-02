const express = require('express');
const Miner = require('./src/mine');
const bodyParser = require('body-parser');

const app = express();
const miner = new Miner(500); // 500 ms

const PORT = 3001;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('got it!');
});

app.get('/start', (req, res) => {
  miner.start();
  res.send('started mining');
});

app.get('/stop', (req, res) => {
  miner.stop();
  res.send('stopped mining');
});

app.listen(PORT, () => {
  console.log('listening on port 3001!');
});

