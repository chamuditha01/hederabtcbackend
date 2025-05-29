const express = require('express');
const Web3 = require('web3');
const cors = require('cors');



const PRIVATE_KEY = '70a2a3ccdda50314d92e0ebf6596ef95943d1fc352c9c470fdbc688acddb4316';
const CONTRACT_ADDRESS = '0x0003f045459580fff5C9c987E747d73C86502bbb';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "prediction",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "actualPrice",
        "type": "int256"
      }
    ],
    "name": "resolveRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const RPC_URL = 'https://testnet.hashio.io/api';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://btcdapp.netlify.app'
}));

// Set up web3 and contract
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const backendAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(backendAccount);

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
let nonceLock = false;
let lastNonce = null;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});