## POW-Express

1. In one terminal run: `npm install` && `node index.js`
2. In another terminal: `curl localhost:3000/generate/<number of keys>`
3. Pick two addresses and run `./startClient <amount_to_transfer> <from_address> <to_address>`

The startClient script makes the call to the server to verify and mine the transaction.
