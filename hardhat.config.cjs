require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  // ۱. پشتیبانی از تمامی نسخه‌های سالیدیتی قراردادهای شما
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.6.6" },
      { version: "0.5.16" }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  // ۲. تعریف شبکه اصلی (توصیه شده برای پایداری)
  networks: {
    teqoin: {
      url: "https://rpc.teqoin.io",
      chainId: 420377,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },

  // ۳. تنظیمات اکسپلورر
  etherscan: {
    apiKey: {
      teqoin: "your-api-key-here"
    },
    customChains: [
      {
        network: "teqoin",
        chainId: 420377,
        urls: {
          apiURL: "https://explorer.teqoin.io/api",
          browserURL: "https://explorer.teqoin.io"
        }
      }
    ]
  }
};
