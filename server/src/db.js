const Blockchain = require("./models/Blockchain");

module.exports = {
  utxos: [],
  chain: new Blockchain()
}