import { ethers } from "hardhat";

async function main() {
  const initialValue = 42;
  const Contract = await ethers.getContractFactory("SimpleStorage");
  const contract = await Contract.deploy(initialValue);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SimpleStorage deployed to:", address);

  const currentValue = await contract.get();
  console.log("Initial value:", currentValue.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
