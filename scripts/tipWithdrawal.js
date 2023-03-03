//This is a script to withdraw all the tips sent to the owner
const hre = require("hardhat");
const abi = require("../artifacts/contracts/SupportContract.sol/SupportContract.json");

async function getBalance(provider, address) {
  const myBalanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(myBalanceBigInt);
}

async function main() {
  const address="0xf36A20940bF1ACE13e3812EbeDe0d346e49216B3";
  const ABI = abi.abi;

  //node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const supportContract = new hre.ethers.Contract(address, ABI, signer);
  
  // Check balance of the contract
  console.log("The current  balance of owner is: ", await getBalance(provider, signer.address), "ETH");
  const balanceOfContract = await getBalance(provider, supportContract.address);
  console.log("The current balance of the contract is: ", await getBalance(provider, supportContract.address), "ETH");

  // Withdraw funds.
  if (balanceOfContract !== "0.0") {
    console.log("withdrawing..")
    const Txn = await supportContract.ownerWithdraw();
    await Txn.wait();
  } else {
    console.log("error, there is no fund to withdraw!");
  }

  // Check balance.
  console.log("owner current balance: ", await getBalance(provider, signer.address), "ETH");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });