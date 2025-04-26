// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EscrowContract
 * @dev Escrow contract for freelance job payments in ETH and ERC20 tokens
 */
contract EscrowContract is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");

    // Platform fee percentage (5%)
    uint256 public platformFeePercent = 5;
    address public platformFeeAddress;

    // Job status enum
    enum JobStatus {
        Created,
        Funded,
        InProgress,
        Completed,
        Disputed,
        Cancelled
    }

    // Payment type
    enum PaymentType {
        ETH,
        ERC20
    }

    // Job struct
    struct Job {
        uint256 jobId;
        address client;
        address freelancer;
        uint256 amount;
        uint256 platformFee;
        PaymentType paymentType;
        address tokenAddress; // null for ETH
        JobStatus status;
        bool isLocked; // locked during disputes
        uint256 createdAt;
        uint256 completedAt;
    }

    // Mapping of jobId to Job
    mapping(uint256 => Job) public jobs;

    // Events
    event JobCreated(uint256 indexed jobId, address indexed client, uint256 amount, PaymentType paymentType);
    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event JobStarted(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId);
    event FundsReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event JobDisputed(uint256 indexed jobId);
    event DisputeResolved(uint256 indexed jobId, address winner);
    event JobCancelled(uint256 indexed jobId);

    /**
     * @dev Constructor sets up roles
     */
    constructor(address _platformFeeAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PLATFORM_ROLE, msg.sender);
        platformFeeAddress = _platformFeeAddress;
    }

    /**
     * @dev Create a new job with ETH funding
     * @param _jobId The unique job ID
     * @param _freelancer The freelancer's address
     */
    function createJobWithEth(uint256 _jobId, address _freelancer) external payable nonReentrant {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(jobs[_jobId].client == address(0), "Job ID already exists");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 jobAmount = msg.value - platformFee;

        jobs[_jobId] = Job({
            jobId: _jobId,
            client: msg.sender,
            freelancer: _freelancer,
            amount: jobAmount,
            platformFee: platformFee,
            paymentType: PaymentType.ETH,
            tokenAddress: address(0),
            status: JobStatus.Funded,
            isLocked: false,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit JobCreated(_jobId, msg.sender, jobAmount, PaymentType.ETH);
        emit JobFunded(_jobId, msg.sender, jobAmount);
    }

    /**
     * @dev Create a new job with ERC20 token funding
     * @param _jobId The unique job ID
     * @param _freelancer The freelancer's address
     * @param _tokenAddress The ERC20 token address
     * @param _amount The amount to fund (in token's smallest unit)
     */
    function createJobWithERC20(
        uint256 _jobId,
        address _freelancer,
        address _tokenAddress,
        uint256 _amount
    ) external nonReentrant {
        require(_amount > 0, "Payment amount must be greater than 0");
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_tokenAddress != address(0), "Invalid token address");
        require(jobs[_jobId].client == address(0), "Job ID already exists");

        uint256 platformFee = (_amount * platformFeePercent) / 100;
        uint256 jobAmount = _amount - platformFee;
        uint256 totalAmount = _amount;

        // Transfer tokens from client to this contract
        IERC20 token = IERC20(_tokenAddress);
        token.safeTransferFrom(msg.sender, address(this), totalAmount);

        jobs[_jobId] = Job({
            jobId: _jobId,
            client: msg.sender,
            freelancer: _freelancer,
            amount: jobAmount,
            platformFee: platformFee,
            paymentType: PaymentType.ERC20,
            tokenAddress: _tokenAddress,
            status: JobStatus.Funded,
            isLocked: false,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit JobCreated(_jobId, msg.sender, jobAmount, PaymentType.ERC20);
        emit JobFunded(_jobId, msg.sender, jobAmount);
    }

    /**
     * @dev Start the job (freelancer accepts)
     * @param _jobId The job ID
     */
    function startJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.freelancer == msg.sender, "Only assigned freelancer can start the job");
        require(job.status == JobStatus.Funded, "Job must be in funded state");

        job.status = JobStatus.InProgress;
        emit JobStarted(_jobId, msg.sender);
    }

    /**
     * @dev Complete the job and release funds
     * @param _jobId The job ID
     */
    function completeJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only the client can complete the job");
        require(job.status == JobStatus.InProgress, "Job must be in progress");
        require(!job.isLocked, "Job is locked due to a dispute");

        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;

        // Release funds to freelancer
        if (job.paymentType == PaymentType.ETH) {
            // Transfer ETH
            (bool successFreelancer, ) = payable(job.freelancer).call{value: job.amount}("");
            require(successFreelancer, "Failed to send ETH to freelancer");

            (bool successPlatform, ) = payable(platformFeeAddress).call{value: job.platformFee}("");
            require(successPlatform, "Failed to send ETH to platform");
        } else {
            // Transfer ERC20 tokens
            IERC20 token = IERC20(job.tokenAddress);
            token.safeTransfer(job.freelancer, job.amount);
            token.safeTransfer(platformFeeAddress, job.platformFee);
        }

        emit JobCompleted(_jobId);
        emit FundsReleased(_jobId, job.freelancer, job.amount);
    }

    /**
     * @dev Initiate a dispute for a job
     * @param _jobId The job ID
     */
    function initiateDispute(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(
            msg.sender == job.client || msg.sender == job.freelancer,
            "Only client or freelancer can initiate dispute"
        );
        require(job.status == JobStatus.InProgress, "Job must be in progress");

        job.status = JobStatus.Disputed;
        job.isLocked = true;

        emit JobDisputed(_jobId);
    }

    /**
     * @dev Resolve a dispute and release funds accordingly
     * @param _jobId The job ID
     * @param _releaseToFreelancer Whether to release funds to freelancer
     * @param _splitRatio If not releasing to freelancer, the percentage to give to freelancer (0-100)
     */
    function resolveDispute(
        uint256 _jobId,
        bool _releaseToFreelancer,
        uint8 _splitRatio
    ) external nonReentrant onlyRole(ADMIN_ROLE) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Disputed, "Job must be in disputed state");
        require(job.isLocked, "Job is not locked");

        if (_releaseToFreelancer) {
            // Release all funds to freelancer
            if (job.paymentType == PaymentType.ETH) {
                (bool successFreelancer, ) = payable(job.freelancer).call{value: job.amount}("");
                require(successFreelancer, "Failed to send ETH to freelancer");

                (bool successPlatform, ) = payable(platformFeeAddress).call{value: job.platformFee}("");
                require(successPlatform, "Failed to send ETH to platform");
            } else {
                IERC20 token = IERC20(job.tokenAddress);
                token.safeTransfer(job.freelancer, job.amount);
                token.safeTransfer(platformFeeAddress, job.platformFee);
            }

            emit DisputeResolved(_jobId, job.freelancer);
        } else if (_splitRatio > 0) {
            // Split funds between freelancer and client
            require(_splitRatio <= 100, "Split ratio must be between 0 and 100");

            uint256 freelancerAmount = (job.amount * _splitRatio) / 100;
            uint256 clientAmount = job.amount - freelancerAmount;

            if (job.paymentType == PaymentType.ETH) {
                // Transfer ETH
                (bool successFreelancer, ) = payable(job.freelancer).call{value: freelancerAmount}("");
                require(successFreelancer, "Failed to send ETH to freelancer");

                (bool successClient, ) = payable(job.client).call{value: clientAmount}("");
                require(successClient, "Failed to send ETH to client");

                (bool successPlatform, ) = payable(platformFeeAddress).call{value: job.platformFee}("");
                require(successPlatform, "Failed to send ETH to platform");
            } else {
                // Transfer ERC20 tokens
                IERC20 token = IERC20(job.tokenAddress);
                token.safeTransfer(job.freelancer, freelancerAmount);
                token.safeTransfer(job.client, clientAmount);
                token.safeTransfer(platformFeeAddress, job.platformFee);
            }

            emit DisputeResolved(_jobId, address(0)); // No clear winner
        } else {
            // Refund all funds to client
            if (job.paymentType == PaymentType.ETH) {
                (bool successClient, ) = payable(job.client).call{value: job.amount + job.platformFee}("");
                require(successClient, "Failed to send ETH to client");
            } else {
                IERC20 token = IERC20(job.tokenAddress);
                token.safeTransfer(job.client, job.amount + job.platformFee);
            }

            emit DisputeResolved(_jobId, job.client);
        }

        job.status = JobStatus.Completed;
        job.isLocked = false;
        job.completedAt = block.timestamp;
    }

    /**
     * @dev Cancel a job and refund client (only for funded jobs that haven't started)
     * @param _jobId The job ID
     */
    function cancelJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only client can cancel the job");
        require(job.status == JobStatus.Funded, "Job must be in funded state");

        job.status = JobStatus.Cancelled;

        // Refund the client
        if (job.paymentType == PaymentType.ETH) {
            (bool success, ) = payable(job.client).call{value: job.amount + job.platformFee}("");
            require(success, "Failed to send ETH to client");
        } else {
            IERC20 token = IERC20(job.tokenAddress);
            token.safeTransfer(job.client, job.amount + job.platformFee);
        }

        emit JobCancelled(_jobId);
    }

    /**
     * @dev Update the platform fee percentage
     * @param _newFeePercent The new fee percentage
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyRole(ADMIN_ROLE) {
        require(_newFeePercent <= 20, "Fee too high");
        platformFeePercent = _newFeePercent;
    }

    /**
     * @dev Update the platform fee address
     * @param _newFeeAddress The new fee address
     */
    function updatePlatformFeeAddress(address _newFeeAddress) external onlyRole(ADMIN_ROLE) {
        require(_newFeeAddress != address(0), "Invalid address");
        platformFeeAddress = _newFeeAddress;
    }

    /**
     * @dev Get job details
     * @param _jobId The job ID
     */
    function getJobDetails(uint256 _jobId) external view returns (
        address client,
        address freelancer,
        uint256 amount,
        uint256 platformFee,
        PaymentType paymentType,
        address tokenAddress,
        JobStatus status,
        bool isLocked,
        uint256 createdAt,
        uint256 completedAt
    ) {
        Job storage job = jobs[_jobId];
        return (
            job.client,
            job.freelancer,
            job.amount,
            job.platformFee,
            job.paymentType,
            job.tokenAddress,
            job.status,
            job.isLocked,
            job.createdAt,
            job.completedAt
        );
    }

    // Function to receive ETH
    receive() external payable {}
} 