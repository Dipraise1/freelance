use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::job::{Job, JobStatus, Milestone};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowStatus {
    Active,
    Released,
    Refunded,
    Disputed
}

#[account]
pub struct Escrow {
    pub job: Pubkey,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
    pub status: EscrowStatus,
    pub token_mint: Option<Pubkey>, // None means SOL, Some(pubkey) means SPL token
    pub created_at: i64,
    pub updated_at: i64,
    pub completed_milestones: Vec<u8>, // Indices of completed milestones
}

impl Escrow {
    pub const SPACE: usize = 8 + // discriminator
        32 + // job
        32 + // client
        32 + // freelancer
        8 + // amount
        1 + // status
        1 + 32 + // token_mint (Option<Pubkey>)
        8 + // created_at
        8 + // updated_at
        4 + 50; // completed_milestones (Vec<u8> - max 50 milestones)
}

#[event]
pub struct EscrowCreated {
    pub job: Pubkey,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
    pub is_token: bool,
}

#[event]
pub struct EscrowReleased {
    pub job: Pubkey,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct MilestoneCompleted {
    pub job: Pubkey,
    pub escrow: Pubkey,
    pub milestone_index: u8,
    pub amount: u64,
}

#[event]
pub struct EscrowRefunded {
    pub job: Pubkey,
    pub client: Pubkey,
    pub amount: u64,
}

#[derive(Accounts)]
#[instruction(amount: u64, token_mint: Option<Pubkey>)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    
    #[account(
        mut,
        constraint = job_account.client == client.key() @ ErrorCode::UnauthorizedAccess,
        constraint = job_account.status == JobStatus::InProgress @ ErrorCode::JobNotInProgress,
        constraint = job_account.freelancer.is_some() @ ErrorCode::FreelancerNotAssigned,
    )]
    pub job_account: Account<'info, Job>,
    
    #[account(
        init,
        payer = client,
        space = Escrow::SPACE,
    )]
    pub escrow_account: Account<'info, Escrow>,
    
    pub system_program: Program<'info, System>,
    
    // Optional token accounts
    pub token_program: Option<Program<'info, Token>>,
    
    #[account(mut)]
    pub token_mint: Option<Account<'info, Mint>>,
    
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = client,
    )]
    pub client_token_account: Option<Account<'info, TokenAccount>>,
    
    #[account(
        init_if_needed,
        payer = client,
        associated_token::mint = token_mint,
        associated_token::authority = escrow_account,
    )]
    pub escrow_token_account: Option<Account<'info, TokenAccount>>,
    
    pub associated_token_program: Option<Program<'info, AssociatedToken>>,
    pub rent: Option<Sysvar<'info, Rent>>,
}

#[derive(Accounts)]
#[instruction(job_id: u64)]
pub struct ReleaseEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    
    #[account(
        mut,
        constraint = job_account.client == client.key() @ ErrorCode::UnauthorizedAccess,
        constraint = job_account.escrow.is_some() @ ErrorCode::EscrowNotCreated,
        constraint = job_account.escrow.unwrap() == escrow_account.key() @ ErrorCode::InvalidEscrow,
    )]
    pub job_account: Account<'info, Job>,
    
    #[account(
        mut,
        constraint = escrow_account.job == job_account.key() @ ErrorCode::InvalidEscrow,
        constraint = escrow_account.status == EscrowStatus::Active @ ErrorCode::EscrowNotActive,
    )]
    pub escrow_account: Account<'info, Escrow>,
    
    #[account(
        mut,
        constraint = freelancer.key() == job_account.freelancer.unwrap() @ ErrorCode::InvalidFreelancer,
    )]
    /// CHECK: This account is not written to, just receives funds
    pub freelancer: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
    
    // Optional token accounts
    pub token_program: Option<Program<'info, Token>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
    )]
    pub escrow_token_account: Option<Account<'info, TokenAccount>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
        token::authority = freelancer,
    )]
    pub freelancer_token_account: Option<Account<'info, TokenAccount>>,
}

#[derive(Accounts)]
#[instruction(job_id: u64, milestone_index: u8)]
pub struct MilestonePayment<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    
    #[account(
        mut,
        constraint = job_account.client == client.key() @ ErrorCode::UnauthorizedAccess,
        constraint = job_account.escrow.is_some() @ ErrorCode::EscrowNotCreated,
        constraint = job_account.escrow.unwrap() == escrow_account.key() @ ErrorCode::InvalidEscrow,
        constraint = job_account.has_milestones @ ErrorCode::JobDoesNotHaveMilestones,
    )]
    pub job_account: Account<'info, Job>,
    
    #[account(
        mut,
        constraint = escrow_account.job == job_account.key() @ ErrorCode::InvalidEscrow,
        constraint = escrow_account.status == EscrowStatus::Active @ ErrorCode::EscrowNotActive,
    )]
    pub escrow_account: Account<'info, Escrow>,
    
    #[account(
        mut,
        constraint = freelancer.key() == job_account.freelancer.unwrap() @ ErrorCode::InvalidFreelancer,
    )]
    /// CHECK: This account is not written to, just receives funds
    pub freelancer: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
    
    // Optional token accounts
    pub token_program: Option<Program<'info, Token>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
    )]
    pub escrow_token_account: Option<Account<'info, TokenAccount>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
        token::authority = freelancer,
    )]
    pub freelancer_token_account: Option<Account<'info, TokenAccount>>,
}

#[derive(Accounts)]
#[instruction(job_id: u64)]
pub struct RefundEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    
    #[account(
        mut,
        constraint = job_account.client == client.key() @ ErrorCode::UnauthorizedAccess,
        constraint = job_account.escrow.is_some() @ ErrorCode::EscrowNotCreated,
        constraint = job_account.escrow.unwrap() == escrow_account.key() @ ErrorCode::InvalidEscrow,
    )]
    pub job_account: Account<'info, Job>,
    
    #[account(
        mut,
        constraint = escrow_account.job == job_account.key() @ ErrorCode::InvalidEscrow,
        constraint = escrow_account.status == EscrowStatus::Active @ ErrorCode::EscrowNotActive,
    )]
    pub escrow_account: Account<'info, Escrow>,
    
    pub system_program: Program<'info, System>,
    
    // Optional token accounts
    pub token_program: Option<Program<'info, Token>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
    )]
    pub escrow_token_account: Option<Account<'info, TokenAccount>>,
    
    #[account(
        mut,
        token::mint = escrow_account.token_mint.unwrap(),
        token::authority = client,
    )]
    pub client_token_account: Option<Account<'info, TokenAccount>>,
}

pub fn create_escrow(
    ctx: Context<CreateEscrow>,
    amount: u64,
    token_mint: Option<Pubkey>,
) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    let escrow = &mut ctx.accounts.escrow_account;
    let client = &ctx.accounts.client;
    let clock = Clock::get()?;
    
    // Validate inputs
    if amount == 0 {
        return err!(ErrorCode::InvalidAmount);
    }
    
    // Initialize escrow
    escrow.job = job.key();
    escrow.client = client.key();
    escrow.freelancer = job.freelancer.unwrap();
    escrow.amount = amount;
    escrow.status = EscrowStatus::Active;
    escrow.token_mint = token_mint;
    escrow.created_at = clock.unix_timestamp;
    escrow.updated_at = clock.unix_timestamp;
    escrow.completed_milestones = Vec::new();
    
    // Update job with escrow reference
    job.escrow = Some(escrow.key());
    job.updated_at = clock.unix_timestamp;
    
    // Transfer funds from client to escrow
    if let Some(token_mint) = token_mint {
        // Transfer SPL tokens
        let client_token_account = ctx.accounts.client_token_account.as_ref().unwrap();
        let escrow_token_account = ctx.accounts.escrow_token_account.as_ref().unwrap();
        let token_program = ctx.accounts.token_program.as_ref().unwrap();
        
        let transfer_instruction = Transfer {
            from: client_token_account.to_account_info(),
            to: escrow_token_account.to_account_info(),
            authority: client.to_account_info(),
        };
        
        token::transfer(
            CpiContext::new(
                token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;
    } else {
        // Transfer SOL
        let rent = Rent::get()?;
        let transfer_amount = amount;
        
        if client.lamports() < transfer_amount {
            return err!(ErrorCode::InsufficientFunds);
        }
        
        // Transfer from client to escrow account
        **escrow.to_account_info().try_borrow_mut_lamports()? += transfer_amount;
        **client.to_account_info().try_borrow_mut_lamports()? -= transfer_amount;
    }
    
    // Emit event
    emit!(EscrowCreated {
        job: job.key(),
        client: client.key(),
        freelancer: escrow.freelancer,
        amount,
        is_token: token_mint.is_some(),
    });
    
    Ok(())
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>, job_id: u64) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    let escrow = &mut ctx.accounts.escrow_account;
    let freelancer = &ctx.accounts.freelancer;
    let clock = Clock::get()?;
    
    // Calculate amount to release (full escrow amount if no milestones or all milestones have been paid)
    let mut amount_to_release = escrow.amount;
    
    if job.has_milestones {
        // Check if there are any milestones that haven't been paid
        let milestones = job.milestones.as_ref().unwrap();
        let total_milestone_count = milestones.len();
        let completed_milestone_count = escrow.completed_milestones.len();
        
        if completed_milestone_count < total_milestone_count {
            // Calculate remaining amount
            let paid_amount: u64 = escrow.completed_milestones.iter()
                .map(|&idx| {
                    let milestone = &milestones[idx as usize];
                    (escrow.amount * milestone.amount as u64) / 10000
                })
                .sum();
            
            amount_to_release = escrow.amount.saturating_sub(paid_amount);
        }
    }
    
    // Update escrow status
    escrow.status = EscrowStatus::Released;
    escrow.updated_at = clock.unix_timestamp;
    
    // Update job status
    job.status = JobStatus::Completed;
    job.updated_at = clock.unix_timestamp;
    
    // Transfer funds from escrow to freelancer
    if let Some(token_mint) = escrow.token_mint {
        // Transfer SPL tokens
        let escrow_token_account = ctx.accounts.escrow_token_account.as_ref().unwrap();
        let freelancer_token_account = ctx.accounts.freelancer_token_account.as_ref().unwrap();
        let token_program = ctx.accounts.token_program.as_ref().unwrap();
        
        let transfer_instruction = Transfer {
            from: escrow_token_account.to_account_info(),
            to: freelancer_token_account.to_account_info(),
            authority: escrow.to_account_info(),
        };
        
        let seeds = &[
            b"escrow",
            escrow.job.as_ref(),
            &[1], // bump seed
        ];
        let signer = &[&seeds[..]];
        
        token::transfer(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                transfer_instruction,
                signer,
            ),
            amount_to_release,
        )?;
    } else {
        // Transfer SOL
        if escrow.to_account_info().lamports() < amount_to_release {
            return err!(ErrorCode::InsufficientFunds);
        }
        
        **freelancer.to_account_info().try_borrow_mut_lamports()? += amount_to_release;
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount_to_release;
    }
    
    // Emit event
    emit!(EscrowReleased {
        job: job.key(),
        client: escrow.client,
        freelancer: escrow.freelancer,
        amount: amount_to_release,
    });
    
    Ok(())
}

pub fn milestone_payment(
    ctx: Context<MilestonePayment>,
    job_id: u64,
    milestone_index: u8,
) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    let escrow = &mut ctx.accounts.escrow_account;
    let freelancer = &ctx.accounts.freelancer;
    let clock = Clock::get()?;
    
    // Validate milestone index
    let milestones = job.milestones.as_ref().unwrap();
    if milestone_index as usize >= milestones.len() {
        return err!(ErrorCode::InvalidMilestoneIndex);
    }
    
    // Check if milestone is already completed
    if escrow.completed_milestones.contains(&milestone_index) {
        return err!(ErrorCode::MilestoneAlreadyPaid);
    }
    
    // Calculate milestone amount
    let milestone = &milestones[milestone_index as usize];
    let amount_to_release = (escrow.amount * milestone.amount as u64) / 10000;
    
    // Add milestone to completed list
    escrow.completed_milestones.push(milestone_index);
    escrow.updated_at = clock.unix_timestamp;
    
    // Update milestone as completed in job
    if let Some(ref mut milestones) = job.milestones {
        milestones[milestone_index as usize].completed = true;
    }
    job.updated_at = clock.unix_timestamp;
    
    // Transfer funds from escrow to freelancer
    if let Some(token_mint) = escrow.token_mint {
        // Transfer SPL tokens
        let escrow_token_account = ctx.accounts.escrow_token_account.as_ref().unwrap();
        let freelancer_token_account = ctx.accounts.freelancer_token_account.as_ref().unwrap();
        let token_program = ctx.accounts.token_program.as_ref().unwrap();
        
        let transfer_instruction = Transfer {
            from: escrow_token_account.to_account_info(),
            to: freelancer_token_account.to_account_info(),
            authority: escrow.to_account_info(),
        };
        
        let seeds = &[
            b"escrow",
            escrow.job.as_ref(),
            &[1], // bump seed
        ];
        let signer = &[&seeds[..]];
        
        token::transfer(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                transfer_instruction,
                signer,
            ),
            amount_to_release,
        )?;
    } else {
        // Transfer SOL
        if escrow.to_account_info().lamports() < amount_to_release {
            return err!(ErrorCode::InsufficientFunds);
        }
        
        **freelancer.to_account_info().try_borrow_mut_lamports()? += amount_to_release;
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount_to_release;
    }
    
    // Check if all milestones are completed, and if so, update job status
    if escrow.completed_milestones.len() == milestones.len() {
        job.status = JobStatus::Completed;
        escrow.status = EscrowStatus::Released;
    }
    
    // Emit event
    emit!(MilestoneCompleted {
        job: job.key(),
        escrow: escrow.key(),
        milestone_index,
        amount: amount_to_release,
    });
    
    Ok(())
}

pub fn refund_escrow(ctx: Context<RefundEscrow>, job_id: u64) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    let escrow = &mut ctx.accounts.escrow_account;
    let client = &ctx.accounts.client;
    let clock = Clock::get()?;
    
    // Calculate amount to refund (remaining amount after any milestone payments)
    let mut refund_amount = escrow.amount;
    
    if job.has_milestones && !escrow.completed_milestones.is_empty() {
        // Calculate remaining amount
        let milestones = job.milestones.as_ref().unwrap();
        let paid_amount: u64 = escrow.completed_milestones.iter()
            .map(|&idx| {
                let milestone = &milestones[idx as usize];
                (escrow.amount * milestone.amount as u64) / 10000
            })
            .sum();
        
        refund_amount = escrow.amount.saturating_sub(paid_amount);
    }
    
    // Update escrow status
    escrow.status = EscrowStatus::Refunded;
    escrow.updated_at = clock.unix_timestamp;
    
    // Update job status (if not completed due to milestone payments)
    if job.status != JobStatus::Completed {
        job.status = JobStatus::Cancelled;
    }
    job.updated_at = clock.unix_timestamp;
    
    // Transfer funds from escrow to client
    if let Some(token_mint) = escrow.token_mint {
        // Transfer SPL tokens
        let escrow_token_account = ctx.accounts.escrow_token_account.as_ref().unwrap();
        let client_token_account = ctx.accounts.client_token_account.as_ref().unwrap();
        let token_program = ctx.accounts.token_program.as_ref().unwrap();
        
        let transfer_instruction = Transfer {
            from: escrow_token_account.to_account_info(),
            to: client_token_account.to_account_info(),
            authority: escrow.to_account_info(),
        };
        
        let seeds = &[
            b"escrow",
            escrow.job.as_ref(),
            &[1], // bump seed
        ];
        let signer = &[&seeds[..]];
        
        token::transfer(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                transfer_instruction,
                signer,
            ),
            refund_amount,
        )?;
    } else {
        // Transfer SOL
        if escrow.to_account_info().lamports() < refund_amount {
            return err!(ErrorCode::InsufficientFunds);
        }
        
        **client.to_account_info().try_borrow_mut_lamports()? += refund_amount;
        **escrow.to_account_info().try_borrow_mut_lamports()? -= refund_amount;
    }
    
    // Emit event
    emit!(EscrowRefunded {
        job: job.key(),
        client: escrow.client,
        amount: refund_amount,
    });
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
    
    #[msg("Job is not in progress")]
    JobNotInProgress,
    
    #[msg("Freelancer not assigned to job")]
    FreelancerNotAssigned,
    
    #[msg("Invalid amount (must be greater than 0)")]
    InvalidAmount,
    
    #[msg("Escrow not created for job")]
    EscrowNotCreated,
    
    #[msg("Invalid escrow for job")]
    InvalidEscrow,
    
    #[msg("Escrow is not active")]
    EscrowNotActive,
    
    #[msg("Invalid freelancer account")]
    InvalidFreelancer,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
    
    #[msg("Job does not have milestones")]
    JobDoesNotHaveMilestones,
    
    #[msg("Invalid milestone index")]
    InvalidMilestoneIndex,
    
    #[msg("Milestone already paid")]
    MilestoneAlreadyPaid,
} 