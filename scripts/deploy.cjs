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
  //
  // IMPORTANT: There is no safe default here. The previous fallback value
  // (0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) is the real WETH contract
  // on ETHEREUM MAINNET. It does not exist on the TeQoin network (chainId
  // 420377), so silently falling back to it would deploy a Router pointed
  // at a meaningless address on this chain -- every ETH-based swap function
  // (swapExactETHForTokens, swapExactTokensForETH, etc.) would then be
  // broken in a way that's easy to miss until a real user hits it.
  //
  // Instead, we require WETH_ADDRESS to be explicitly set and fail loudly
  // if it isn't.
  const wethAddress = process.env.WETH_ADDRESS;

  if (!wethAddress) {
    console.error("====================================================");
    console.error("❌ ERROR: WETH_ADDRESS environment variable is not set!");
    console.error("There is no safe default wrapped-native-token address for the TeQoin network.");
    console.error("To fix this:");
    console.error("1. Deploy (or find) the wrapped native token contract for TeQoin.");
    console.error("2. Go to your GitHub repository: https://github.com/maryoa61/TeQoin-DEX-Developer-Suite");
    console.error("3. Navigate to Settings -> Secrets and variables -> Actions");
    console.error("4. Add a Repository Secret named 'WETH_ADDRESS' with that contract's address.");
    console.error("====================================================");
    process.exit(1);
  }

  const normalizedWethAddress = wethAddress.toLowerCase();
  if (!hre.ethers.isAddress(normalizedWethAddress)) {
    console.error("❌ ERROR: WETH_ADDRESS is set but is not a valid address:", wethAddress);
    process.exit(1);
  }

  console.log("Step 2: Configuring Wrapped native token...");
  console.log("WETH address used for Router deployment:", normalizedWethAddress);
  console.log("----------------------------------------------------");

  // 3. Deploy Router
  console.log("Step 3: Deploying UniswapV2Router02...");
  console.log("Parameters -> Factory:", factoryAddress, "| WETH:", normalizedWethAddress);

  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factoryAddress, normalizedWethAddress);
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
