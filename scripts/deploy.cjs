const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.error("====================================================");
    console.error("❌ ERROR: No deployer seed/private key found!");
    console.error("Please configure the 'PRIVATE_KEY' environment variable or GitHub Repository Secret.");
    console.error("To fix this:");
    console.error("1. Go to your GitHub repository: https://github.com/maryoa61/TeQoin-DEX-Developer-Suite");
    console.error("2. Navigate to Settings -> Secrets and variables -> Actions");
    console.error("3. Add a Repository Secret named 'PRIVATE_KEY' with your deployer private key (hex format).");
    console.error("====================================================");
    process.exit(1);
  }
  const deployer = signers[0];
  console.log("====================================================");
  console.log("Starting real-world deployment on TeQoin Network...");
  console.log("Deployer account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "TEQ");
  console.log("====================================================");

  // 1. Deploy Factory
  // We can use deployer's address as fee setter
  const feeSetterAddress = deployer.address;
  console.log("Step 1: Deploying UniswapV2Factory...");
  console.log("Fee Setter Address set to:", feeSetterAddress);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(feeSetterAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("✔ SUCCESS: UniswapV2Factory deployed to:", factoryAddress);
  const factoryTx = factory.deploymentTransaction();
  console.log("Deploy Transaction Hash:", factoryTx ? factoryTx.hash : "N/A");
  console.log("----------------------------------------------------");

  // 2. Wrapped Native configuration (WETH address)
  // Feel free to replace this with your network's actual wrapped token address
  const wethAddress = (process.env.WETH_ADDRESS || "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2").toLowerCase();
  console.log("Step 2: Configuring Wrapped native token...");
  console.log("WETH address used for Router deployment:", wethAddress);
  console.log("----------------------------------------------------");

  // 3. Deploy Router
  console.log("Step 3: Deploying UniswapV2Router02...");
  console.log("Parameters -> Factory:", factoryAddress, "| WETH:", wethAddress);

  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factoryAddress, wethAddress);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();

  console.log("✔ SUCCESS: UniswapV2Router02 deployed to:", routerAddress);
  const routerTx = router.deploymentTransaction();
  console.log("Deploy Transaction Hash:", routerTx ? routerTx.hash : "N/A");
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
