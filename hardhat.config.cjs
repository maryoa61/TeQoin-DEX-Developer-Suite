
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // تنظیم نسخه کامپایلر برای هماهنگی با همه قراردادها
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.6.6" },
      { version: "0.5.16" }
    ]
  },
  networks: {
    teqoin: {
      url: process.env.TEQOIN_RPC_URL || "https://rpc.teqoin.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
