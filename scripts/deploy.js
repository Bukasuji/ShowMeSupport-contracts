
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const SupportContract = await hre.ethers.getContractFactory("SupportContract");
  const supportContract = await SupportContract.deploy();

  await supportContract.deployed();

  console.log("SupportContract deployed to:", supportContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });