# Decentralized Freelance Marketplace

A decentralized marketplace built on Solana, connecting freelancers and clients in a secure, transparent environment.

## Project Structure

The project consists of two main parts:

### Frontend

Built with Next.js, the frontend provides a modern, responsive user interface for interacting with the marketplace.

Key features:
- Homepage with marketplace overview
- Job posting and browsing functionality
- Freelancer profiles and portfolios
- Secure wallet integration for transactions

### Smart Contracts

The Solana contracts handle the core marketplace functionality, including:
- Job creation and management
- Bidding system
- Escrow for secure payments
- Dispute resolution
- User profiles and reviews

## Development Status

### Completed
- Frontend homepage and job posting UI
- Core React components and styling
- Wallet integration infrastructure
- Smart contract module structure

### In Progress
- Solana contract bug fixes and development
- Backend-frontend integration
- User profile functionality

## Smart Contract Issues to Fix

The current smart contract implementation has several issues that need to be addressed:

1. **Missing Dependencies**
   - Add `anchor-spl` as a dependency in Cargo.toml
   - Configure the project to use the proper Solana and Anchor versions

2. **Structure Inconsistencies**
   - Align the function signatures in lib.rs with their implementations
   - Fix field mismatches between structs and their usage

3. **Type Corrections**
   - Fix parameter types in function calls
   - Address the trait bounds issues with Context

## Running the Project

### Frontend
```
cd frontend
npm install
npm run dev
```

### Backend (Smart Contracts)
```
cd contracts/solana/freelance_marketplace
anchor build
anchor deploy
```

## Next Steps

1. Complete and fix the smart contract implementation
2. Integrate wallet functionality with the frontend
3. Implement the job bidding system
4. Add profile pages for freelancers and clients
5. Develop the escrow and payment system
6. Add dispute resolution mechanisms

## License

This project is licensed under the MIT License - see the LICENSE file for details.
