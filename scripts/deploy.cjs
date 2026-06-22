const hre = require("hardhat");

async function main() {
  console.log("--- شروع فرآیند دیپلوی ---");

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
  // آدرس WETH شبکه تکوئین (اگر متفاوته، اینجا اصلاح کن)
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2"; 
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH_ADDRESS);
  await router.waitForDeployment();
  console.log("ROUTER_ADDRESS:", await router.getAddress());

  console.log("--- تمام شد! آدرس‌ها را ذخیره کن ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
