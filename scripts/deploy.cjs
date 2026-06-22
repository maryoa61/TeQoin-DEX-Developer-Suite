const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("====================================================");
  console.log("Starting real-world deployment on TeQoin Network...");
  console.log("Deployer account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "TEQ");
  console.log("====================================================");

  // 1. Deploy Factory
  // We can use deployer's address as fee setter
  const feeSetterAddress = deployer.address;
  console.log("Step 1: Deploying UniswapV2Factory...");
  console.log("Fee Setter Address set to:", feeSetterAddress);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(feeSetterAddress);
  await factory.deployed();

  console.log("✔ SUCCESS: UniswapV2Factory deployed to:", factory.address);
  console.log("Deploy Transaction Hash:", factory.deployTransaction.hash);
  console.log("----------------------------------------------------");

  // 2. Wrapped Native configuration (WETH address)
  // Feel free to replace this with your network's actual wrapped token address
  const wethAddress = process.env.WETH_ADDRESS || "0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2";
  console.log("Step 2: Configuring Wrapped native token...");
  console.log("WETH address used for Router deployment:", wethAddress);
  console.log("----------------------------------------------------");

  // 3. Deploy Router
  console.log("Step 3: Deploying UniswapV2Router02...");
  console.log("Parameters -> Factory:", factory.address, "| WETH:", wethAddress);

  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factory.address, wethAddress);
  await router.deployed();

  console.log("✔ SUCCESS: UniswapV2Router02 deployed to:", router.address);
  console.log("Deploy Transaction Hash:", router.deployTransaction.hash);
  console.log("====================================================");
  console.log("Uniswap V2 Deployment finished successfully on TeQoin!");
  console.log("Factory hash:", await factory.pairCodeHash());
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Critical error during deployment:", error);
    process.exit(1);
  });
