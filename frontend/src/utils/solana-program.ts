import { PublicKey } from '@solana/web3.js';

// Program ID from deployments
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Simplified IDL definition for our Freelance Marketplace program
export const IDL = {
  version: '0.1.0',
  name: 'freelance_marketplace',
  instructions: [
    {
      name: 'createJob',
      accounts: [
        {
          name: 'jobAccount',
          isMut: true,
          isSigner: true
        },
        {
          name: 'client',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'jobId',
          type: 'u64'
        },
        {
          name: 'title',
          type: 'string'
        },
        {
          name: 'description',
          type: 'string'
        },
        {
          name: 'budget',
          type: 'u64'
        },
        {
          name: 'deadline',
          type: 'i64'
        },
        {
          name: 'currency',
          type: 'string'
        }
      ]
    },
    {
      name: 'placeBid',
      accounts: [],
      args: []
    },
    {
      name: 'acceptBid',
      accounts: [],
      args: []
    },
    {
      name: 'createEscrow',
      accounts: [],
      args: []
    }
  ],
  accounts: [
    {
      name: 'Job',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'client',
            type: 'publicKey'
          },
          {
            name: 'jobId',
            type: 'u64'
          },
          {
            name: 'title',
            type: 'string'
          },
          {
            name: 'description',
            type: 'string'
          },
          {
            name: 'budget',
            type: 'u64'
          },
          {
            name: 'deadline',
            type: 'i64'
          },
          {
            name: 'currency',
            type: 'string'
          },
          {
            name: 'status',
            type: 'string'
          }
        ]
      }
    }
  ],
  metadata: {
    address: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
  }
}; 