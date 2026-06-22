require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.6.6" },
      { version: "0.5.16" }
    ]
  },
  networks: {
    teqoin: {
      url: "https://rpc.teqoin.io", // آدرسِ جدید و درست
      chainId: 420377,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
