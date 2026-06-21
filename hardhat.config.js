require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load values safely from environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const TEQOIN_RPC_URL = process.env.TEQOIN_RPC_URL || "https://rpc.teqoin.com";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {},
    teqoin: {
      url: TEQOIN_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1827,
      gas: "auto",
      gasPrice: "auto"
    }
  }
};
