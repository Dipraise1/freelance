// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WormholeBridge
 * @dev Bridge contract to handle cross-chain payments via Wormhole
 * Note: This is a simplified implementation. In a production environment,
 * you would use the actual Wormhole SDK and contracts.
 */
contract WormholeBridge is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    // Wormhole related addresses (would be real addresses in production)
    address public wormholeCore;
    address public tokenBridge;

    // Supported tokens
    mapping(address => bool) public supportedTokens;
    // Destination chain IDs (Solana = 1, Ethereum = 2, etc.)
    mapping(uint16 => bool) public supportedChains;
    
    // Fee percentage for cross-chain transfers (0.5%)
    uint256 public bridgeFeePercent = 50; // 0.5% = 50 basis points
    address public feeCollector;

    // Transfer struct to track cross-chain transfers
    struct Transfer {
        uint256 jobId;
        address sender;
        address recipient; // Ethereum address, for Solana would be bytes32
        address token;
        uint256 amount;
        uint16 targetChain;
        bool isSent;
        uint256 timestamp;
    }

    // Mapping of transferId to Transfer
    mapping(uint256 => Transfer) public transfers;
    uint256 public nextTransferId = 1;

    // Events
    event TransferInitiated(
        uint256 indexed transferId,
        uint256 indexed jobId,
        address sender,
        address token,
        uint256 amount,
        uint16 targetChain
    );
    event TransferCompleted(
        uint256 indexed transferId,
        uint256 indexed jobId,
        address recipient,
        address token,
        uint256 amount
    );

    /**
     * @dev Constructor sets up roles and addresses
     */
    constructor(address _wormholeCore, address _tokenBridge, address _feeCollector) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(RELAYER_ROLE, msg.sender);
        
        wormholeCore = _wormholeCore;
        tokenBridge = _tokenBridge;
        feeCollector = _feeCollector;
        
        // Add Ethereum (2) as supported chain
        supportedChains[2] = true;
        // Add Solana (1) as supported chain
        supportedChains[1] = true;
    }

    /**
     * @dev Initiate a cross-chain transfer
     * @param _jobId The job ID associated with this transfer
     * @param _recipient Recipient address (Ethereum format)
     * @param _token Token address to transfer
     * @param _amount Amount to transfer
     * @param _targetChain Target chain ID
     */
    function initiateTransfer(
        uint256 _jobId,
        address _recipient,
        address _token,
        uint256 _amount,
        uint16 _targetChain
    ) external nonReentrant {
        require(supportedTokens[_token], "Token not supported");
        require(supportedChains[_targetChain], "Chain not supported");
        require(_amount > 0, "Amount must be greater than 0");

        // Calculate fee
        uint256 fee = (_amount * bridgeFeePercent) / 10000;
        uint256 transferAmount = _amount - fee;
        
        // Transfer tokens from sender to this contract
        IERC20 token = IERC20(_token);
        token.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Send fee to fee collector
        if (fee > 0) {
            token.safeTransfer(feeCollector, fee);
        }
        
        // In a real implementation, here you would:
        // 1. Approve the token bridge to spend the tokens
        // token.approve(tokenBridge, transferAmount);
        // 2. Call the token bridge to initiate the transfer
        // ITokenBridge(tokenBridge).transferTokens(token, transferAmount, _targetChain, recipientBytes, 0, 0);
        
        // For this simplified example, we just record the transfer
        uint256 transferId = nextTransferId++;
        transfers[transferId] = Transfer({
            jobId: _jobId,
            sender: msg.sender,
            recipient: _recipient,
            token: _token,
            amount: transferAmount,
            targetChain: _targetChain,
            isSent: true,
            timestamp: block.timestamp
        });
        
        emit TransferInitiated(transferId, _jobId, msg.sender, _token, transferAmount, _targetChain);
    }

    /**
     * @dev Complete a cross-chain transfer (called by relayer)
     * This is a simplified version. In a real implementation, the Wormhole
     * Guardian network would verify signatures and the token bridge would
     * release wrapped tokens.
     *
     * @param _transferId The transfer ID to complete
     * @param _recipient The recipient address
     * @param _token The token address
     * @param _amount The amount to transfer
     */
    function completeTransfer(
        uint256 _transferId,
        address _recipient,
        address _token,
        uint256 _amount
    ) external nonReentrant onlyRole(RELAYER_ROLE) {
        // In a real implementation, this would verify a VAA (Verified Action Approval)
        // from Wormhole and release the correct tokens.
        
        // For this simplified example, we just transfer the tokens
        IERC20 token = IERC20(_token);
        token.safeTransfer(_recipient, _amount);
        
        // Record the completion
        Transfer storage transfer = transfers[_transferId];
        
        emit TransferCompleted(_transferId, transfer.jobId, _recipient, _token, _amount);
    }

    /**
     * @dev Add a supported token
     * @param _token The token address to add
     */
    function addSupportedToken(address _token) external onlyRole(ADMIN_ROLE) {
        require(_token != address(0), "Invalid token address");
        supportedTokens[_token] = true;
    }

    /**
     * @dev Remove a supported token
     * @param _token The token address to remove
     */
    function removeSupportedToken(address _token) external onlyRole(ADMIN_ROLE) {
        supportedTokens[_token] = false;
    }

    /**
     * @dev Add a supported chain
     * @param _chainId The chain ID to add
     */
    function addSupportedChain(uint16 _chainId) external onlyRole(ADMIN_ROLE) {
        supportedChains[_chainId] = true;
    }

    /**
     * @dev Remove a supported chain
     * @param _chainId The chain ID to remove
     */
    function removeSupportedChain(uint16 _chainId) external onlyRole(ADMIN_ROLE) {
        supportedChains[_chainId] = false;
    }

    /**
     * @dev Update the bridge fee percentage
     * @param _newFeePercent The new fee percentage in basis points (e.g., 50 = 0.5%)
     */
    function updateBridgeFee(uint256 _newFeePercent) external onlyRole(ADMIN_ROLE) {
        require(_newFeePercent <= 500, "Fee too high"); // Max 5%
        bridgeFeePercent = _newFeePercent;
    }

    /**
     * @dev Update the fee collector address
     * @param _newFeeCollector The new fee collector address
     */
    function updateFeeCollector(address _newFeeCollector) external onlyRole(ADMIN_ROLE) {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
    }

    /**
     * @dev Get transfer details
     * @param _transferId The transfer ID
     */
    function getTransferDetails(uint256 _transferId) external view returns (
        uint256 jobId,
        address sender,
        address recipient,
        address token,
        uint256 amount,
        uint16 targetChain,
        bool isSent,
        uint256 timestamp
    ) {
        Transfer storage transfer = transfers[_transferId];
        return (
            transfer.jobId,
            transfer.sender,
            transfer.recipient,
            transfer.token,
            transfer.amount,
            transfer.targetChain,
            transfer.isSent,
            transfer.timestamp
        );
    }
} 