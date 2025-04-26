// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IEscrowContract {
    function resolveDispute(
        uint256 _jobId,
        bool _releaseToFreelancer,
        uint8 _splitRatio
    ) external;

    function getJobDetails(uint256 _jobId) external view returns (
        address client,
        address freelancer,
        uint256 amount,
        uint256 platformFee,
        uint8 paymentType,
        address tokenAddress,
        uint8 status,
        bool isLocked,
        uint256 createdAt,
        uint256 completedAt
    );
}

/**
 * @title DisputeContract
 * @dev Contract to handle disputes in the freelance marketplace
 */
contract DisputeContract is AccessControl, ReentrancyGuard {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");

    // Reference to escrow contract
    IEscrowContract public escrowContract;

    // Resolution types
    enum ResolutionType {
        PendingResolution,
        ReleaseToFreelancer,
        RefundToClient,
        Split
    }

    // Dispute struct
    struct Dispute {
        uint256 jobId;
        address client;
        address freelancer;
        address initiator;
        string reason;
        string evidenceURI; // IPFS URI with evidence
        ResolutionType resolutionType;
        uint8 splitRatio; // 0-100, percentage to freelancer if Split
        address resolvedBy;
        string resolutionNotes;
        uint256 createdAt;
        uint256 resolvedAt;
        bool isResolved;
    }

    // Mapping of jobId to Dispute
    mapping(uint256 => Dispute) public disputes;
    // All dispute IDs for enumeration
    uint256[] public disputeIds;

    // Events
    event DisputeCreated(
        uint256 indexed jobId,
        address indexed client,
        address indexed freelancer,
        address initiator,
        string reason,
        string evidenceURI
    );
    event EvidenceAdded(uint256 indexed jobId, address indexed submitter, string evidenceURI);
    event DisputeResolved(
        uint256 indexed jobId,
        ResolutionType resolutionType,
        address resolvedBy,
        string resolutionNotes
    );

    /**
     * @dev Constructor sets up roles and reference to escrow contract
     */
    constructor(address _escrowContract) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(RESOLVER_ROLE, msg.sender);
        escrowContract = IEscrowContract(_escrowContract);
    }

    /**
     * @dev Create a new dispute
     * @param _jobId The job ID
     * @param _reason The reason for the dispute
     * @param _evidenceURI IPFS URI with evidence
     */
    function createDispute(
        uint256 _jobId,
        string calldata _reason,
        string calldata _evidenceURI
    ) external nonReentrant {
        // Get job details from escrow contract
        (
            address client,
            address freelancer,
            ,,,,,,,
        ) = escrowContract.getJobDetails(_jobId);

        // Verify sender is either client or freelancer
        require(
            msg.sender == client || msg.sender == freelancer,
            "Only client or freelancer can create dispute"
        );

        // Verify dispute doesn't already exist
        require(disputes[_jobId].createdAt == 0, "Dispute already exists");

        // Create dispute
        disputes[_jobId] = Dispute({
            jobId: _jobId,
            client: client,
            freelancer: freelancer,
            initiator: msg.sender,
            reason: _reason,
            evidenceURI: _evidenceURI,
            resolutionType: ResolutionType.PendingResolution,
            splitRatio: 0,
            resolvedBy: address(0),
            resolutionNotes: "",
            createdAt: block.timestamp,
            resolvedAt: 0,
            isResolved: false
        });

        disputeIds.push(_jobId);

        emit DisputeCreated(_jobId, client, freelancer, msg.sender, _reason, _evidenceURI);
    }

    /**
     * @dev Add evidence to an existing dispute
     * @param _jobId The job ID
     * @param _evidenceURI IPFS URI with evidence
     */
    function addEvidence(uint256 _jobId, string calldata _evidenceURI) external nonReentrant {
        Dispute storage dispute = disputes[_jobId];
        require(dispute.createdAt > 0, "Dispute does not exist");
        require(!dispute.isResolved, "Dispute already resolved");

        // Verify sender is either client or freelancer
        require(
            msg.sender == dispute.client || msg.sender == dispute.freelancer,
            "Only client or freelancer can add evidence"
        );

        // Update the evidence URI
        // In production, you might want to append to a list of evidence instead
        dispute.evidenceURI = _evidenceURI;

        emit EvidenceAdded(_jobId, msg.sender, _evidenceURI);
    }

    /**
     * @dev Resolve a dispute
     * @param _jobId The job ID
     * @param _resolutionType The resolution type
     * @param _splitRatio The split ratio if resolution type is Split
     * @param _resolutionNotes Notes explaining the resolution
     */
    function resolveDispute(
        uint256 _jobId,
        ResolutionType _resolutionType,
        uint8 _splitRatio,
        string calldata _resolutionNotes
    ) external nonReentrant onlyRole(RESOLVER_ROLE) {
        Dispute storage dispute = disputes[_jobId];
        require(dispute.createdAt > 0, "Dispute does not exist");
        require(!dispute.isResolved, "Dispute already resolved");

        if (_resolutionType == ResolutionType.Split) {
            require(_splitRatio > 0 && _splitRatio <= 100, "Split ratio must be between 1 and 100");
        }

        // Update dispute resolution
        dispute.resolutionType = _resolutionType;
        dispute.splitRatio = _resolutionType == ResolutionType.Split ? _splitRatio : 0;
        dispute.resolvedBy = msg.sender;
        dispute.resolutionNotes = _resolutionNotes;
        dispute.resolvedAt = block.timestamp;
        dispute.isResolved = true;

        // Call escrow contract to resolve the dispute
        bool releaseToFreelancer = _resolutionType == ResolutionType.ReleaseToFreelancer;
        escrowContract.resolveDispute(_jobId, releaseToFreelancer, _splitRatio);

        emit DisputeResolved(_jobId, _resolutionType, msg.sender, _resolutionNotes);
    }

    /**
     * @dev Get dispute details
     * @param _jobId The job ID
     */
    function getDisputeDetails(uint256 _jobId) external view returns (
        address client,
        address freelancer,
        address initiator,
        string memory reason,
        string memory evidenceURI,
        ResolutionType resolutionType,
        uint8 splitRatio,
        address resolvedBy,
        string memory resolutionNotes,
        uint256 createdAt,
        uint256 resolvedAt,
        bool isResolved
    ) {
        Dispute storage dispute = disputes[_jobId];
        return (
            dispute.client,
            dispute.freelancer,
            dispute.initiator,
            dispute.reason,
            dispute.evidenceURI,
            dispute.resolutionType,
            dispute.splitRatio,
            dispute.resolvedBy,
            dispute.resolutionNotes,
            dispute.createdAt,
            dispute.resolvedAt,
            dispute.isResolved
        );
    }

    /**
     * @dev Get the number of disputes
     */
    function getDisputeCount() external view returns (uint256) {
        return disputeIds.length;
    }

    /**
     * @dev Update the escrow contract address
     * @param _newEscrowContract The new escrow contract address
     */
    function updateEscrowContract(address _newEscrowContract) external onlyRole(ADMIN_ROLE) {
        require(_newEscrowContract != address(0), "Invalid address");
        escrowContract = IEscrowContract(_newEscrowContract);
    }
} 