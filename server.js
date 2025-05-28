const express = require('express');
const Web3 = require('web3');
const cors = require('cors');



const PRIVATE_KEY = '70a2a3ccdda50314d92e0ebf6596ef95943d1fc352c9c470fdbc688acddb4316'; // Replace this with your backend account key
const CONTRACT_ADDRESS = '0x0003f045459580fff5C9c987E747d73C86502bbb';
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roundId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "prediction",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeesWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Payout",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Refund",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roundId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "endPrice",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "closestPrediction",
				"type": "int256"
			}
		],
		"name": "RoundResolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roundId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bettingEndTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roundEndTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "startPrice",
				"type": "int256"
			}
		],
		"name": "RoundStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "currentRoundId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "depositToWallet",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "gameWallets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentRoundBetDetails",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "players",
				"type": "address[]"
			},
			{
				"internalType": "int256[]",
				"name": "predictions",
				"type": "int256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getGameWalletBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "roundId",
				"type": "uint256"
			}
		],
		"name": "getRoundDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bettingEndTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "roundEndTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			},
			{
				"internalType": "int256",
				"name": "startPrice",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "endPrice",
				"type": "int256"
			},
			{
				"internalType": "address[]",
				"name": "players",
				"type": "address[]"
			},
			{
				"internalType": "int256[]",
				"name": "predictions",
				"type": "int256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
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
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rounds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bettingEndTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "roundEndTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			},
			{
				"internalType": "int256",
				"name": "startPrice",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "endPrice",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "price",
				"type": "int256"
			}
		],
		"name": "startNewRound",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalFeesCollected",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFromWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
const RPC_URL = 'https://testnet.hashio.io/api';

const app = express();
app.use(express.json());
const allowedOrigins = ['https://btcdapp.netlify.app', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// Set up web3 and contract
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const backendAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(backendAccount);

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
let nonceLock = false;
let lastNonce = null;

async function getSafeNonce() {
  while (nonceLock) {
    await new Promise((resolve) => setTimeout(resolve, 50)); // wait 50ms
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

// POST endpoint to place a bet
app.post('/place-bet', async (req, res) => {
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

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    console.error('Backend placeBet failed:', err);
    res.status(500).json({ error: 'Bet failed', message: err.message });
  }
});


app.listen(3001, () => console.log('Server running on port 3001'));
