const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();
  console.log("UniswapV2Factory deployed to:", factory.address);

  const WETH_ADDRESS = "0x0000000000000000000000000000000000000000"; 

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, WETH_ADDRESS);
  await router.deployed();
  console.log("UniswapV2Router02 deployed to:", router.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
