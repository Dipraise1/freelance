# Decentralized Freelance Marketplace with Cross-Chain Payments

A Web3 freelance platform where clients can post jobs and freelancers can get paid in SOL, ETH, or USDC, with cross-chain transfers via Wormhole.

## 🚀 Overview

This decentralized freelance marketplace connects clients with Web3 talent for blockchain-related work:

- **Job Creation** - Clients post jobs with budgets in SOL, ETH, or USDC
- **Cross-Chain Escrow** - Secure payments held in escrow until job completion
- **Support System** - Admins can review and resolve disputes between clients and freelancers
- **On-Chain Portfolios** - Freelancers build verifiable work histories and ratings
- **Wormhole Integration** - Cross-chain transfers between Solana and Ethereum

## 🏗️ Architecture

### Smart Contracts

#### Solana Contracts (Rust/Anchor)
- `job.rs` - Job posting, bidding, and acceptance
- `escrow.rs` - Fund escrow for jobs with SOL
- `dispute.rs` - Dispute initiation and resolution
- `portfolio.rs` - Freelancer profiles and reviews

#### Ethereum Contracts (Solidity)
- `EscrowContract.sol` - Fund escrow for jobs with ETH/USDC
- `DisputeContract.sol` - Dispute handling on Ethereum
- `WormholeBridge.sol` - Cross-chain transfers via Wormhole

### Frontend (Next.js/React)
- Modern UI for browsing jobs, posting jobs, and managing disputes
- Wallet integration (Phantom for Solana, MetaMask for Ethereum)
- Admin dashboard for resolving disputes

## 🔧 Tech Stack

- **Blockchains**: Solana, Ethereum
- **Cross-Chain Bridge**: Wormhole
- **Solana**: Rust, Anchor
- **Ethereum**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Storage**: IPFS for evidence and job details

## 💰 Monetization

- **Platform Fee**: 5% per job payment
- **Premium Features**: Priority job listings, portfolio analytics, expedited dispute resolution
- **Token Rewards**: Future implementation for fee discounts

## 🔐 Security Features

- **Secure Escrow**: Funds remain locked until job completion or dispute resolution
- **Admin-Controlled Dispute Resolution**: Trusted admins review evidence and resolve disputes
- **Cross-Chain Security**: Wormhole's secure guardians and relayers for bridging assets

## 📝 Getting Started

### Prerequisites

- Node.js v16+
- Rust and Cargo
- Solana CLI
- Anchor Framework
- Hardhat
- Phantom Wallet (Solana)
- MetaMask (Ethereum)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/decentralized-freelance-marketplace.git
   cd decentralized-freelance-marketplace
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Build Solana contracts:
   ```bash
   cd contracts/solana
   anchor build
   ```

4. Build Ethereum contracts:
   ```bash
   cd contracts/ethereum
   npm install
   npx hardhat compile
   ```

### Running Locally

1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Deploy to local Solana validator:
   ```bash
   cd contracts/solana
   anchor deploy
   ```

3. Deploy to local Ethereum network:
   ```bash
   cd contracts/ethereum
   npx hardhat run scripts/deploy.js
   ```

## 🧪 Testing

### Solana Contracts
```bash
cd contracts/solana
anchor test
```

### Ethereum Contracts
```bash
cd contracts/ethereum
npx hardhat test
```

## 📚 Project Structure

```
├── contracts/
│   ├── solana/               # Solana smart contracts
│   │   ├── programs/         # Anchor programs
│   │   └── tests/            # Anchor tests
│   └── ethereum/             # Ethereum smart contracts
│       ├── contracts/        # Solidity contracts
│       └── scripts/          # Deployment scripts
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
└── docs/                     # Documentation
```

## 🔄 Workflow

1. **Client Posts Job**: 
   - Client creates job listing with requirements and budget
   - Funds are transferred to escrow contract

2. **Freelancers Bid**:
   - Freelancers review job and submit proposals
   - Client reviews bids and portfolios

3. **Job Execution**:
   - Client accepts a bid to start the job
   - Freelancer completes work and submits for review

4. **Payment Release**:
   - Client reviews and approves work
   - Escrow contract releases payment to freelancer
   - Platform fee is deducted

5. **Dispute Resolution** (if needed):
   - Client or freelancer initiates dispute
   - Admin reviews job details, chats, and submissions
   - Admin decides fair resolution (release to freelancer, refund client, or split funds)
   - Decision is executed on-chain

## 🚨 Support System

The support system handles disputes when either party is unhappy:

1. **Dispute Initiation**: 
   - Either party can request support via the "Request Support" button
   - Escrow funds are locked during dispute resolution

2. **Evidence Submission**:
   - Both parties can submit evidence stored on IPFS
   - Chat logs are accessible to the admin

3. **Admin Review**:
   - Admins access a dashboard showing all dispute details
   - They can review job specifications, chat logs, and deliverables

4. **Resolution**:
   - Admin makes a decision: pay freelancer, refund client, or split payment
   - Resolution is executed on-chain
   - Reputation scores update accordingly

## 🛣️ Roadmap

- **Phase 1**: Basic job posting, bidding, and escrow (SOL)
- **Phase 2**: Cross-chain payments with Wormhole (SOL, ETH, USDC)
- **Phase 3**: Dispute resolution system
- **Phase 4**: Enhanced portfolios and reputation system
- **Phase 5**: DAO governance for dispute resolution

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or feedback, please open an issue or contact the team at [your-email@example.com]. # freelance
