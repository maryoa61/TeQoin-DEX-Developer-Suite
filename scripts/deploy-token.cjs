const { ethers } = require("hardhat");

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");
  console.log("در حال دیپلوی توکن...");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  console.log("توکن با موفقیت در این آدرس دیپلوی شد:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
