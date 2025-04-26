use anchor_lang::prelude::*;
use crate::job::{Job, JobStatus};
use crate::escrow::Escrow;

#[account]
pub struct Dispute {
    pub job_id: u64,
    pub escrow: Pubkey,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub initiator: Pubkey,
    pub reason: String,
    pub evidence_ipfs: String,
    pub is_resolved: bool,
    pub resolution_details: Option<ResolutionDetails>,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ResolutionDetails {
    pub resolved_by: Pubkey,
    pub resolution_type: ResolutionType,
    pub split_ratio: Option<u64>, // If split, percentage to freelancer (0-100)
    pub resolution_note: String,
    pub resolved_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ResolutionType {
    ReleaseToFreelancer,
    RefundToClient,
    Split,
}

#[derive(Accounts)]
#[instruction(job_id: u64, reason: String, evidence_ipfs: String)]
pub struct InitiateDispute<'info> {
    #[account(
        init,
        payer = initiator,
        space = 8 + 8 + 32 + 32 + 32 + 32 + 4 + reason.len() + 4 + evidence_ipfs.len() + 1 + 200 + 8
    )]
    pub dispute: Account<'info, Dispute>,
    #[account(mut, constraint = job.job_id == job_id)]
    pub job: Account<'info, Job>,
    #[account(mut, constraint = escrow.job_id == job_id)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub initiator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(job_id: u64, release_to_freelancer: bool, split_ratio: u64)]
pub struct ResolveDispute<'info> {
    #[account(mut, constraint = dispute.job_id == job_id)]
    pub dispute: Account<'info, Dispute>,
    #[account(mut, constraint = job.job_id == job_id)]
    pub job: Account<'info, Job>,
    #[account(mut, constraint = escrow.job_id == job_id)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: This is safe as we validate it matches the job's client
    #[account(mut, constraint = client.key() == job.client)]
    pub client: AccountInfo<'info>,
    /// CHECK: This is safe as we validate it matches the job's selected_freelancer
    #[account(mut, constraint = freelancer.key() == job.selected_freelancer.unwrap())]
    pub freelancer: AccountInfo<'info>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: This is safe as we're just sending platform fees
    #[account(mut)]
    pub platform_fee_account: AccountInfo<'info>,
    /// CHECK: This is the admin account that should be verified
    #[account(address = admin_account::ID)]
    pub admin_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

// Admin account ID (would be replaced with actual admin pubkey in production)
pub mod admin_account {
    use solana_program::pubkey::Pubkey;
    use solana_program::pubkey;
    pub static ID: Pubkey = pubkey!("AdminAccountPubkeyHere11111111111111111111111");
}

pub fn initiate_dispute(
    ctx: Context<InitiateDispute>,
    job_id: u64,
    reason: String,
    evidence_ipfs: String,
) -> Result<()> {
    let dispute = &mut ctx.accounts.dispute;
    let job = &mut ctx.accounts.job;
    let escrow = &mut ctx.accounts.escrow;
    
    // Check if job is in progress and has an escrow account
    require!(job.status == JobStatus::InProgress, DisputeError::InvalidJobStatus);
    require!(job.selected_freelancer.is_some(), DisputeError::NoFreelancerSelected);
    
    // Check if the initiator is either the client or the freelancer
    let initiator = ctx.accounts.initiator.key();
    require!(
        initiator == &job.client || initiator == job.selected_freelancer.as_ref().unwrap(),
        DisputeError::UnauthorizedInitiator
    );
    
    // Lock the escrow funds
    escrow.is_locked = true;
    
    // Update job status
    job.status = JobStatus::Disputed;
    
    // Set dispute details
    dispute.job_id = job_id;
    dispute.escrow = ctx.accounts.escrow.key();
    dispute.client = job.client;
    dispute.freelancer = job.selected_freelancer.unwrap();
    dispute.initiator = *initiator;
    dispute.reason = reason;
    dispute.evidence_ipfs = evidence_ipfs;
    dispute.is_resolved = false;
    dispute.resolution_details = None;
    dispute.created_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn resolve_dispute(
    ctx: Context<ResolveDispute>,
    job_id: u64,
    release_to_freelancer: bool,
    split_ratio: u64,
) -> Result<()> {
    let dispute = &mut ctx.accounts.dispute;
    let job = &mut ctx.accounts.job;
    let escrow = &mut ctx.accounts.escrow;
    
    // Check that dispute isn't already resolved
    require!(!dispute.is_resolved, DisputeError::AlreadyResolved);
    // Validate that the split ratio is within range
    if !release_to_freelancer && split_ratio > 0 {
        require!(split_ratio <= 100, DisputeError::InvalidSplitRatio);
    }
    
    // Determine the resolution type
    let resolution_type = if release_to_freelancer {
        ResolutionType::ReleaseToFreelancer
    } else if split_ratio > 0 {
        ResolutionType::Split
    } else {
        ResolutionType::RefundToClient
    };
    
    // Handle funds transfer based on resolution
    let amount = escrow.amount;
    let platform_fee = escrow.platform_fee;
    
    match resolution_type {
        ResolutionType::ReleaseToFreelancer => {
            // Transfer all funds to freelancer
            **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.freelancer.try_borrow_mut_lamports()? += amount;
            
            // Transfer platform fee
            **escrow.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
            **ctx.accounts.platform_fee_account.try_borrow_mut_lamports()? += platform_fee;
        },
        ResolutionType::RefundToClient => {
            // Refund all funds to client
            **escrow.to_account_info().try_borrow_mut_lamports()? -= amount + platform_fee;
            **ctx.accounts.client.try_borrow_mut_lamports()? += amount + platform_fee;
        },
        ResolutionType::Split => {
            // Calculate split amounts
            let freelancer_amount = amount * split_ratio / 100;
            let client_amount = amount - freelancer_amount;
            
            // Transfer to freelancer
            **escrow.to_account_info().try_borrow_mut_lamports()? -= freelancer_amount;
            **ctx.accounts.freelancer.try_borrow_mut_lamports()? += freelancer_amount;
            
            // Transfer to client
            **escrow.to_account_info().try_borrow_mut_lamports()? -= client_amount;
            **ctx.accounts.client.try_borrow_mut_lamports()? += client_amount;
            
            // Handle platform fee based on split ratio
            let freelancer_fee = platform_fee * split_ratio / 100;
            let client_fee = platform_fee - freelancer_fee;
            
            // Transfer platform fee from escrow
            **escrow.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
            **ctx.accounts.platform_fee_account.try_borrow_mut_lamports()? += platform_fee;
        }
    }
    
    // Mark dispute as resolved
    dispute.is_resolved = true;
    dispute.resolution_details = Some(ResolutionDetails {
        resolved_by: *ctx.accounts.admin.key,
        resolution_type,
        split_ratio: if resolution_type == ResolutionType::Split { Some(split_ratio) } else { None },
        resolution_note: String::from("Dispute resolved by admin"),
        resolved_at: Clock::get()?.unix_timestamp,
    });
    
    // Unlock escrow
    escrow.is_locked = false;
    
    // Update job status
    job.status = JobStatus::Completed;
    
    Ok(())
}

#[error_code]
pub enum DisputeError {
    #[msg("Job is not in progress")]
    InvalidJobStatus,
    #[msg("No freelancer selected for the job")]
    NoFreelancerSelected,
    #[msg("Only client or freelancer can initiate a dispute")]
    UnauthorizedInitiator,
    #[msg("Dispute already resolved")]
    AlreadyResolved,
    #[msg("Split ratio must be between 0 and 100")]
    InvalidSplitRatio,
} 