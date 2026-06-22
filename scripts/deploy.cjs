const hre = require("hardhat");

async function main() {
  console.log("--- شروع فرآیند دیپلوی نهایی ---");

  // 1. دیپلوی توکن تست
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TEST_TOKEN_ADDRESS:", tokenAddress);

  // 2. دیپلوی UniswapV2Factory
  const [deployer] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("FACTORY_ADDRESS:", factoryAddress);

  // 3. دیپلوی UniswapV2Router02
  // آدرس WETH با فرمت lowercase برای جلوگیری از خطای checksum
  const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; 
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH_ADDRESS);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("ROUTER_ADDRESS:", routerAddress);

  console.log("--- دیپلوی با موفقیت انجام شد! ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
