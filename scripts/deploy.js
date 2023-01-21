
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
  const ShowMeSupport = await hre.ethers.getContractFactory("ShowMeSupport");
  const showMeSupport = await ShowMeSupport.deploy();

  await showMeSupport.deployed();

  console.log("ShowMeSupport deployed to:", showMeSupport.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });