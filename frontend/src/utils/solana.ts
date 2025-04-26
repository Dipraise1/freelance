// Mock implementation for development
import { PublicKey } from '@solana/web3.js';

// Constants
export const PROGRAM_ID = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";

// Types
type WalletType = {
  publicKey: PublicKey;
  // Add other wallet properties as needed
};

// Mock functions for development
export const getCluster = (): string => {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
};

export const getRpcUrl = (): string => {
  return 'https://api.devnet.solana.com';
};

export const getConnection = () => {
  // Mock connection
  return {
    getBalance: async () => 1000000000,
    confirmTransaction: async () => ({ value: { err: null } })
  };
};

export const getProvider = (wallet: WalletType) => {
  // Mock provider
  return {
    wallet,
    connection: getConnection()
  };
};

export const getProgram = (wallet: WalletType) => {
  // Mock program
  return {
    methods: {
      createJob: () => ({
        accounts: () => ({
          signers: () => ({
            rpc: async () => "mock-signature-123456789"
          })
        })
      }),
      placeBid: () => ({
        accounts: () => ({
          rpc: async () => "mock-signature-123456789"
        })
      }),
      acceptBid: () => ({
        accounts: () => ({
          rpc: async () => "mock-signature-123456789"
        })
      }),
      createEscrow: () => ({
        accounts: () => ({
          signers: () => ({
            rpc: async () => "mock-signature-123456789"
          })
        })
      })
    },
    account: {
      job: {
        fetch: async () => ({
          client: new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"),
          jobId: 1,
          title: "Sample Job",
          description: "This is a sample job",
          budget: 1000,
          deadline: Date.now() / 1000 + 86400 * 7,
          currency: "USDC",
          status: "Open",
          escrowAccount: null,
          selectedFreelancer: null,
          bids: []
        })
      }
    }
  };
};

// Create a job
export const createJob = async (
  wallet: WalletType,
  jobId: number,
  title: string,
  description: string,
  budget: number,
  deadline: number,
  currency: string
) => {
  try {
    console.log(`Creating job: ${title} with budget ${budget} ${currency}`);
    
    // For development, return success with mock data
    return {
      success: true,
      signature: "mock-signature-123456789",
      jobAccount: "mock-job-account-123456789"
    };
  } catch (error) {
    console.error('Error creating job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Place a bid on a job
export const placeBid = async (
  wallet: WalletType,
  jobAccountPubkey: string,
  jobId: number,
  bidAmount: number,
  proposal: string,
  timeline: number
) => {
  try {
    console.log(`Placing bid of ${bidAmount} on job ${jobId}`);
    
    // For development, return success with mock data
    return {
      success: true,
      signature: "mock-signature-123456789"
    };
  } catch (error) {
    console.error('Error placing bid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Accept a bid
export const acceptBid = async (
  wallet: WalletType,
  jobAccountPubkey: string,
  jobId: number,
  freelancerPubkey: string
) => {
  try {
    console.log(`Accepting bid from ${freelancerPubkey} for job ${jobId}`);
    
    // For development, return success with mock data
    return {
      success: true,
      signature: "mock-signature-123456789"
    };
  } catch (error) {
    console.error('Error accepting bid:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Create an escrow for a job
export const createEscrow = async (
  wallet: WalletType,
  jobAccountPubkey: string,
  jobId: number,
  amount: number
) => {
  try {
    console.log(`Creating escrow of ${amount} for job ${jobId}`);
    
    // For development, return success with mock data
    return {
      success: true,
      signature: "mock-signature-123456789",
      escrowAccount: "mock-escrow-account-123456789"
    };
  } catch (error) {
    console.error('Error creating escrow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Fetch job details
export const fetchJob = async (wallet: WalletType, jobAccountPubkey: string) => {
  try {
    console.log(`Fetching job details for ${jobAccountPubkey}`);
    
    // For development, return success with mock data
    return {
      success: true,
      data: {
        client: new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"),
        jobId: 1,
        title: "Sample Job",
        description: "This is a sample job",
        budget: 1000,
        deadline: Date.now() / 1000 + 86400 * 7,
        currency: "USDC",
        status: "Open",
        escrowAccount: null,
        selectedFreelancer: null,
        bids: []
      }
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}; 