const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  
  console.log("Deployed to:", await token.getAddress());
}

main().catch((error) => { console.error(error); process.exit(1); });
