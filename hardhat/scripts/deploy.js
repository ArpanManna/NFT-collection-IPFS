const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // URL from where we can extract the metadata for a VIPunks
  //const metadataURL = "ipfs://QmUYybL9hEPTda2UBAm9hvwFGeQZ5LzwtHmnERv57KsVZW/";
  const metadataURL = "gateway.pinata.cloud/ipfs/QmUYybL9hEPTda2UBAm9hvwFGeQZ5LzwtHmnERv57KsVZW/"
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so viPunksContract here is a factory for instances of our VIPunks contract.
  */
  const viPunksContract = await ethers.getContractFactory("VIPunks");
  // deploy the contract
  const deployedVIPunksContract = await viPunksContract.deploy(metadataURL);
  await deployedVIPunksContract.deployed();
  // log the address of the deployed contract
  console.log("VIPunks Contract Address:", deployedVIPunksContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});