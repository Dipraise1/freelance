use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::job::{Job, JobStatus};

#[account]
pub struct Escrow {
    pub job_id: u64,
    pub client: Pubkey,
    pub freelancer: Option<Pubkey>,
    pub amount: u64,
    pub is_locked: bool,
    pub platform_fee: u64,
    pub created_at: i64,
    pub currency: String,
    pub token_account: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(job_id: u64, amount: u64)]
pub struct CreateEscrow<'info> {
    #[account(
        init,
        payer = client,
        space = 8 + 8 + 32 + 33 + 8 + 1 + 8 + 8 + 4 + 10 + 33
    )]
    pub escrow_account: Account<'info, Escrow>,
    #[account(mut, has_one = client)]
    pub job_account: Account<'info, Job>,
    #[account(mut)]
    pub client: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(job_id: u64)]
pub struct ReleaseEscrow<'info> {
    #[account(mut)]
    pub escrow_account: Account<'info, Escrow>,
    #[account(mut, has_one = client)]
    pub job_account: Account<'info, Job>,
    #[account(mut)]
    pub client: Signer<'info>,
    /// CHECK: This is safe as we check against the job's selected_freelancer
    #[account(mut)]
    pub freelancer: AccountInfo<'info>,
    /// CHECK: This is safe as we're just sending platform fees
    #[account(mut)]
    pub platform_fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_escrow(
    ctx: Context<CreateEscrow>,
    job_id: u64,
    amount: u64,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    let job = &mut ctx.accounts.job_account;
    
    require!(job.job_id == job_id, EscrowError::JobIdMismatch);
    require!(job.status == JobStatus::InProgress, EscrowError::JobNotInProgress);
    require!(job.selected_freelancer.is_some(), EscrowError::NoFreelancerSelected);
    
    // Calculate platform fee (5%)
    let platform_fee = amount * 5 / 100;
    let total_amount = amount + platform_fee;
    
    // Transfer funds from client to escrow
    let client_lamports = ctx.accounts.client.lamports();
    require!(client_lamports >= total_amount, EscrowError::InsufficientFunds);
    
    **ctx.accounts.client.try_borrow_mut_lamports()? -= total_amount;
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? += total_amount;
    
    // Update escrow account
    escrow.job_id = job_id;
    escrow.client = *ctx.accounts.client.key;
    escrow.freelancer = job.selected_freelancer;
    escrow.amount = amount;
    escrow.is_locked = false;
    escrow.platform_fee = platform_fee;
    escrow.created_at = Clock::get()?.unix_timestamp;
    escrow.currency = job.currency.clone();
    escrow.token_account = None; // For SOL payments, no token account needed
    
    // Update job with escrow info
    job.escrow_account = Some(ctx.accounts.escrow_account.key());
    
    Ok(())
}

pub fn release_escrow(
    ctx: Context<ReleaseEscrow>,
    job_id: u64,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow_account;
    let job = &mut ctx.accounts.job_account;
    
    require!(escrow.job_id == job_id, EscrowError::JobIdMismatch);
    require!(!escrow.is_locked, EscrowError::EscrowLocked);
    require!(
        job.selected_freelancer.unwrap() == ctx.accounts.freelancer.key(),
        EscrowError::FreelancerMismatch
    );
    
    // Transfer funds from escrow to freelancer (amount) and platform (fee)
    let escrow_lamports = ctx.accounts.escrow_account.to_account_info().lamports();
    let amount = escrow.amount;
    let platform_fee = escrow.platform_fee;
    
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.freelancer.try_borrow_mut_lamports()? += amount;
    
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
    **ctx.accounts.platform_fee_account.try_borrow_mut_lamports()? += platform_fee;
    
    // Update job status
    job.status = JobStatus::Completed;
    
    Ok(())
}

#[error_code]
pub enum EscrowError {
    #[msg("Job ID mismatch")]
    JobIdMismatch,
    #[msg("Job not in progress")]
    JobNotInProgress,
    #[msg("No freelancer selected for the job")]
    NoFreelancerSelected,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Escrow is locked due to a dispute")]
    EscrowLocked,
    #[msg("Freelancer mismatch")]
    FreelancerMismatch,
} 