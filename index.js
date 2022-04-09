
import * as ethUtil from "ethereumjs-util";

import { BigNumber } from "ethers";

// import bnToBuf from "@loopring-web/loopring-sdk/dist/api/sign/poseidon/eddsa.d.ts";
import { EDDSAUtil, toBuffer, bnToBuf } from "@loopring-web/loopring-sdk/dist/index.js";

// import * as fm from "@loopring-web/loopring-sdk/dist";
import { toBig, toHex } from "@loopring-web/loopring-sdk/dist/index.js";

import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

import { convertUtf8ToHex } from "@walletconnect/utils";


// Draft Message Parameters (change your addres and your nonce)
const message = "Sign this message to access Loopring Exchange: 0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4 with key nonce: 0"
const address = "0xe6bedb20f57e694f0c4e28946829bcc4dbdfc4a5"

const msgParams = [
  convertUtf8ToHex(message),           // Required
  address,                             // Required
];

// Create connector
const walletConnector = new NodeWalletConnect.default(
  {
    bridge: "https://bridge.walletconnect.org", // Required
  },
  {
    clientMeta: {
      description: "LooPyGen Minter",
      url: "https://nodejs.org/en/",
      icons: ["https://nodejs.org/static/images/logo.svg"],
      name: "LooPyGen",
    },
  }
);

// Check if connection is already established
if (!walletConnector.connected) {
  // create new session
  walletConnector.createSession().then(() => {
    // get uri for QR Code modal
    const uri = walletConnector.uri;
    // display QR Code modal
    WalletConnectQRCodeModal.open(
      uri,
      () => {
        console.log("QR Code Modal closed");
      },
      true // isNode = true
    );
  });
}


// Subscribe to connection events
walletConnector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Close QR Code Modal
  WalletConnectQRCodeModal.close(
    true // isNode = true
  );
  console.log("connected!")

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
  
  // Sign personal message
  walletConnector
    .signPersonalMessage(msgParams)
    .then((result) => {
      // Returns signature.
      console.log("key seed:", result);
      // console.log("sig:", result.sig);
      const seedBuff = ethUtil.sha256(toBuffer(result));
      // console.log(`seedBuff.toString('hex') ${seedBuff.toString('hex')}`)
      const seed = BigNumber.from("0x" + seedBuff.toString("hex"));
      // console.log(`seed ${seed.toString()}`)
      const bitIntDataItems = bnToBuf(seed.toString());
      // console.log(`bigIntData ${bitIntDataItems}`)
      const keyPair = EDDSAUtil.generateKeyPair(bitIntDataItems);
      // console.log("keyPair", keyPair)

      // const formatedPx = fm.formatEddsaKey(toHex(toBig(keyPair.publicKeyX)));
      // const formatedPy = fm.formatEddsaKey(toHex(toBig(keyPair.publicKeyY)));
      const sk = toHex(toBig(keyPair.secretKey));
      console.log("private key:", sk);
  })
  .catch(error => {
  // Error returned when rejected
  console.error(error);
  })
});

walletConnector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }
  console.log("session updated!")

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

walletConnector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }
  console.log("disconnected!")

  // Delete walletConnector
});