const { utxos, balances } = require('../db');
class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  // can we do something more useful here?
  execute(verified) {
    this.inputs.forEach((input) => {
      input.spent = true;
    });
    this.outputs.forEach((output) => {
      // outut contains owner and amount

      if (verified) {
        const owner = output.owner;
        const amount = output.amount;
        balances[owner].balance += parseInt(amount);
      }

      utxos.push(output);
    });
  }
}

module.exports = Transaction;