require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const TEQOIN_RPC_URL = process.env.TEQOIN_RPC_URL || "https://rpc.teqoin.com"; 
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"; 

module.exports = {
  solidity: {
    compilers: [
      { version: "0.5.16", settings: { optimizer: { enabled: true, runs: 200 } } },
      { version: "0.6.6", settings: { optimizer: { enabled: true, runs: 200 } } }
    ]
  },
  networks: {
    teqoin: {
      url: TEQOIN_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1827
    }
  }
};
