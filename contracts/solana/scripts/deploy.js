const anchor = require('@project-serum/anchor');
const { PublicKey, LAMPORTS_PER_SOL, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Load the program ID from the IDL file
async function loadProgramId() {
  try {
    const idlPath = path.resolve(__dirname, '../target/idl/freelance_marketplace.json');
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
    return new PublicKey(idl.metadata.address);
  } catch (err) {
    console.error('Error loading program ID:', err);
    throw err;
  }
}

// Initialize a connection to the local Solana validator
async function initConnection() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  return { provider, connection: provider.connection };
}

// Fund the deployer wallet
async function fundWallet(connection, wallet, amount = 10) {
  try {
    console.log(`Funding wallet ${wallet.publicKey.toString()} with ${amount} SOL...`);
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Wallet funded! Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (err) {
    console.error('Error funding wallet:', err);
    throw err;
  }
}

// Deploy the program and initialize necessary accounts
async function deployProgram() {
  try {
    console.log('Starting deployment...');
    
    // Initialize connection
    const { provider, connection } = await initConnection();
    const wallet = provider.wallet;
    
    // Load the program ID
    const programId = await loadProgramId();
    console.log(`Program ID: ${programId.toString()}`);
    
    // Ensure wallet has enough SOL
    await fundWallet(connection, wallet);
    
    // Load the program
    const program = new anchor.Program(
      await anchor.Program.fetchIdl(programId, provider),
      provider
    );
    
    console.log('Program deployed successfully!');
    console.log('Program address:', programId.toString());
    
    // Initialize an admin account for dispute resolution
    const adminKeypair = Keypair.generate();
    console.log('Admin keypair generated:', adminKeypair.publicKey.toString());
    
    // Fund the admin account
    await fundWallet(connection, adminKeypair, 5);
    
    // Save deployment info to a file
    const deploymentInfo = {
      programId: programId.toString(),
      adminPublicKey: adminKeypair.publicKey.toString(),
      network: 'localnet',
      deploymentTimestamp: new Date().toISOString(),
    };
    
    const deploymentPath = path.resolve(__dirname, '../deployment-info.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`Deployment info saved to ${deploymentPath}`);
    
    return { programId, program, adminKeypair };
  } catch (err) {
    console.error('Deployment failed:', err);
    throw err;
  }
}

// Run the deployment
deployProgram()
  .then(() => {
    console.log('Deployment completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Deployment failed:', err);
    process.exit(1);
  }); 