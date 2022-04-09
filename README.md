# Install

```shell
npm install
```

# Setup

Change address and your nonce in index.js

Find you nonce by running this API call, and susbstract 1 before putting in the JS

https://api3.loopring.io/api/v3/account?accountId=84767

```js
// Draft Message Parameters (change your addres and your nonce-1)
const message = "Sign this message to access Loopring Exchange: 0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4 with key nonce: 0"
const address = "0xe6bedb20f57e694f0c4e28946829bcc4dbdfc4a5"
```

Add these lines at the end for `node_modules/@loopring_sdk/dist/loopring-sdk.cjs.development.js`

```js
exports.EDDSAUtil = EDDSAUtil;
exports.toBuffer = toBuffer;
exports.bnToBuf = bnToBuf;
```

# Run

Fullscreen your terminal window and run:

```shell
npm start
```