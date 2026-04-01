import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS in your .env file");
  }

  const contract = await ethers.getContractAt("SimpleStorage", contractAddress);

  const currentValue = await contract.get();
  console.log("Current value:", currentValue.toString());

  const tx = await contract.set(99);
  console.log("Submitted tx:", tx.hash);
  await tx.wait();

  const updatedValue = await contract.get();
  console.log("Updated value:", updatedValue.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
