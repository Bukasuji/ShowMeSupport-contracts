const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from Support showed.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const ShowMeSupport = await hre.ethers.getContractFactory("ShowMeSupport");
  const showMeSupport = await ShowMeSupport.deploy();

  // Deploy the contract.
  await showMeSupport.deployed();
  console.log("ShowMeSupport deployed to:", showMeSupport.address);

  // Check balances before  showing Support.
  const addresses = [owner.address, tipper.address, showMeSupport.address];
  console.log("== start ==");
  await printBalances(addresses);

  // show the owner a few Support.
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await showMeSupport.connect(tipper).showSupport("Anezichukwu", "You're the best!", tip);
  await showMeSupport.connect(tipper2).showSupport("Chinedu", "Amazing guy", tip);
  await showMeSupport.connect(tipper3).showSupport("Lawal", "nice one Boss", tip);

  // Check balances after the showing Support.
  console.log("== u just showed Support ==");
  await printBalances(addresses);

  // Withdraw.
  await showMeSupport.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await showMeSupport.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });