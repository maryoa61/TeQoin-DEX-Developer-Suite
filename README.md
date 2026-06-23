# TeQoin-DEX-Developer-Suite 🚀

This project is the result of a grueling marathon fighting GitHub Actions errors, Teqoin network quirks, and various technical hurdles. We have successfully implemented the necessary infrastructure to deploy smart contracts on this network.

## 📌 Contract Status
The smart contract has been successfully deployed to the Teqoin mainnet:

* **Contract Address:** `0x98A05F6dc058be0278fB9760D532f6577f2119D1`
* **Status:** Deployed & Active

## 🛠 Tools Used
* **Solidity:** Compiled with versions 0.8.20, 0.6.6, and 0.5.16.
* **Environment:** Hardhat (Node v18.20.8).
* **Automation:** GitHub Actions (CI/CD Pipeline).

## 🚀 Key Features
* **Automated Deployment:** Deploy your contracts instantly just by pushing code, without manual interventions.
* **DNS Resolution Fix:** Overcame `ENOTFOUND` network limitations using custom host configurations in GitHub runner environments.
* **Multi-Version Support:** Smart compiler configuration to handle different Solidity versions simultaneously.

## 📖 Developer Guide
To develop or build upon this project:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and set your `PRIVATE_KEY`.
4. Use the command `npx hardhat run scripts/deploy.cjs --network teqoin` to deploy.

---
*Built with persistence and relentless debugging!*
