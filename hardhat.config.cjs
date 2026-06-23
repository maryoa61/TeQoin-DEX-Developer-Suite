
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    // این شبکه اصلی
    teqoin: {
      url: "https://rpc.teqoin.io",
      chainId: 420377,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // این شبکه آزمایشی (دقیقاً طبق مستندات تصویر)
    teqoinTestnet: {
      url: "https://rpc-testnet.teqoin.io",
      chainId: 420377, // همان عددی که در تصویر بود
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
