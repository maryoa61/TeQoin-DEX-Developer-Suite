const hre = require("hardhat");

async function main() {
  console.log("--- شروع عملیات دیپلوی ---");

  // 1. دیپلوی توکن تست
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TEST_TOKEN_ADDRESS:", tokenAddress);

  // 2. دیپلوی UniswapV2Factory
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const [deployer] = await hre.ethers.getSigners();
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("Factory deployed to:", factoryAddress);

  // 3. دیپلوی UniswapV2Router02
  // فرض بر این است که آدرس WETH شبکه شما این است
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2"; 
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH_ADDRESS);
  await router.waitForDeployment();
  console.log("Router deployed to:", await router.getAddress());

  console.log("--- عملیات با موفقیت پایان یافت ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
