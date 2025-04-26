use anchor_lang::prelude::*;
use std::collections::BTreeMap;

#[account]
pub struct Job {
    pub client: Pubkey,
    pub job_id: u64,
    pub title: String,
    pub description: String,
    pub budget: u64,
    pub deadline: i64,
    pub currency: String,
    pub status: JobStatus,
    pub escrow_account: Option<Pubkey>,
    pub selected_freelancer: Option<Pubkey>,
    pub bids: BTreeMap<Pubkey, Bid>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum JobStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
    Disputed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Bid {
    pub freelancer: Pubkey,
    pub amount: u64,
    pub proposal: String,
    pub timestamp: i64,
    pub timeline: i64,
    pub status: BidStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum BidStatus {
    Pending,
    Accepted,
    Rejected,
}

// Context for job creation
#[derive(Accounts)]
#[instruction(job_id: u64, title: String, description: String, budget: u64, deadline: i64, currency: String)]
pub struct CreateJob<'info> {
    #[account(init, payer = client, space = 8 + 32 + 8 + 4 + title.len() + 4 + description.len() + 8 + 8 + 4 + currency.len() + 1 + 32 + 32 + 1024)]
    pub job_account: Account<'info, Job>,
    #[account(mut)]
    pub client: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for placing a bid
#[derive(Accounts)]
#[instruction(job_id: u64, bid_amount: u64, proposal: String, timeline: i64)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub job_account: Account<'info, Job>,
    #[account(mut)]
    pub freelancer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for accepting a bid
#[derive(Accounts)]
#[instruction(job_id: u64, freelancer: Pubkey)]
pub struct AcceptBid<'info> {
    #[account(mut, has_one = client)]
    pub job_account: Account<'info, Job>,
    #[account(mut)]
    pub client: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Function implementations
pub fn create_job(
    ctx: Context<CreateJob>,
    job_id: u64,
    title: String,
    description: String,
    budget: u64,
    deadline: i64,
    currency: String,
) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    job.client = *ctx.accounts.client.key;
    job.job_id = job_id;
    job.title = title;
    job.description = description;
    job.budget = budget;
    job.deadline = deadline;
    job.currency = currency;
    job.status = JobStatus::Open;
    job.escrow_account = None;
    job.selected_freelancer = None;
    job.bids = BTreeMap::new();

    Ok(())
}

pub fn place_bid(
    ctx: Context<PlaceBid>,
    job_id: u64,
    bid_amount: u64,
    proposal: String,
    timeline: i64,
) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    require!(job.status == JobStatus::Open, JobError::JobNotOpen);
    
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;
    require!(current_time < job.deadline, JobError::JobDeadlinePassed);

    let bid = Bid {
        freelancer: *ctx.accounts.freelancer.key,
        amount: bid_amount,
        proposal,
        timestamp: current_time,
        timeline,
        status: BidStatus::Pending,
    };

    job.bids.insert(*ctx.accounts.freelancer.key, bid);
    Ok(())
}

pub fn accept_bid(ctx: Context<AcceptBid>, job_id: u64, freelancer: Pubkey) -> Result<()> {
    let job = &mut ctx.accounts.job_account;
    require!(job.status == JobStatus::Open, JobError::JobNotOpen);
    require!(job.bids.contains_key(&freelancer), JobError::BidNotFound);

    // Update bid status to accepted
    if let Some(bid) = job.bids.get_mut(&freelancer) {
        bid.status = BidStatus::Accepted;
    }

    // Update job status to in progress
    job.status = JobStatus::InProgress;
    job.selected_freelancer = Some(freelancer);

    Ok(())
}

#[error_code]
pub enum JobError {
    #[msg("Job is not open for bidding")]
    JobNotOpen,
    #[msg("Job deadline has passed")]
    JobDeadlinePassed,
    #[msg("Bid not found")]
    BidNotFound,
} 