const hre = require("hardhat");

async function main() {
  // 1. دیپلوی توکن تست
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TEST_TOKEN_ADDRESS:", tokenAddress);

  // 2. کدهای قبلی دیپلویِ Factory و Router رو اینجا بذار (همونی که قبلاً کار می‌کرد)
  // ... (کدهای دیپلوی Factory و Router خودت رو اینجا نگه دار)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
