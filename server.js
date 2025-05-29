const express = require('express');
const Web3 = require('web3');
const cors = require('cors');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});