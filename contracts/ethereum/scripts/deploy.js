// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get contract factories
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
  const DisputeContract = await hre.ethers.getContractFactory("DisputeContract");
  const WormholeBridge = await hre.ethers.getContractFactory("WormholeBridge");

  // Deploy escrow contract first
  console.log("Deploying EscrowContract...");
  const platformFeeAddress = deployer.address; // In production, use a multisig wallet
  const escrowContract = await EscrowContract.deploy(platformFeeAddress);
  await escrowContract.deployed();
  console.log("EscrowContract deployed to:", escrowContract.address);

  // Deploy dispute contract
  console.log("Deploying DisputeContract...");
  const disputeContract = await DisputeContract.deploy(escrowContract.address);
  await disputeContract.deployed();
  console.log("DisputeContract deployed to:", disputeContract.address);

  // Deploy Wormhole bridge (using placeholder addresses for now)
  console.log("Deploying WormholeBridge...");
  // In production, use actual Wormhole core and token bridge addresses
  const wormholeCore = "0x0000000000000000000000000000000000000001";
  const tokenBridge = "0x0000000000000000000000000000000000000002";
  const feeCollector = deployer.address; // In production, use a multisig wallet
  
  const wormholeBridge = await WormholeBridge.deploy(
    wormholeCore,
    tokenBridge,
    feeCollector
  );
  await wormholeBridge.deployed();
  console.log("WormholeBridge deployed to:", wormholeBridge.address);

  // Set up roles
  console.log("Setting up roles...");
  
  // Give dispute contract the resolver role
  const resolverRole = await disputeContract.RESOLVER_ROLE();
  await disputeContract.grantRole(resolverRole, deployer.address);
  console.log("Granted RESOLVER_ROLE to:", deployer.address);

  // Give bridge contract appropriate roles
  const relayerRole = await wormholeBridge.RELAYER_ROLE();
  await wormholeBridge.grantRole(relayerRole, deployer.address);
  console.log("Granted RELAYER_ROLE to:", deployer.address);

  console.log("Deployment completed successfully!");

  // Output all deployed addresses for easy reference
  console.log("\nDeployed Contracts Summary:");
  console.log("============================");
  console.log("EscrowContract:", escrowContract.address);
  console.log("DisputeContract:", disputeContract.address);
  console.log("WormholeBridge:", wormholeBridge.address);
  console.log("============================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 