const Web3 = require('web3');

const PRIVATE_KEY = '70a2a3ccdda50314d92e0ebf6596ef95943d1fc352c9c470fdbc688acddb4316';
const CONTRACT_ADDRESS = '0x0003f045459580fff5C9c987E747d73C86502bbb';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" },
      { "internalType": "int256", "name": "prediction", "type": "int256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "int256", "name": "actualPrice", "type": "int256" }],
    "name": "resolveRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const RPC_URL = 'https://testnet.hashio.io/api';

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const backendAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(backendAccount);

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let nonceLock = false;
let lastNonce = null;

async function getSafeNonce() {
  while (nonceLock) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  nonceLock = true;

  if (lastNonce === null) {
    lastNonce = await web3.eth.getTransactionCount(backendAccount.address, 'pending');
  } else {
    lastNonce += 1;
  }

  const safeNonce = lastNonce;
  nonceLock = false;

  return safeNonce;
}

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerAddress, prediction, betAmount } = req.body;

  if (!playerAddress || prediction === undefined || !betAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const depositAmountTinybars = Number(betAmount) * 10 ** 8;
    const nonce = await getSafeNonce();

    const tx = await contract.methods.placeBet(playerAddress, prediction, depositAmountTinybars)
      .send({
        from: backendAccount.address,
        gas: 200000,
        nonce,
      });

    res.status(200).json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    console.error('Backend placeBet failed:', err);
    res.status(500).json({ error: 'Bet failed', message: err.message });
  }
};
