use anchor_lang::prelude::*;
use crate::escrow::PaymentType;
use std::collections::BTreeMap;
use crate::escrow::Escrow;

#[account]
#[derive(Default)]
pub struct Job {
    pub id: u64,
    pub client: Pubkey,
    pub title: String,
    pub description: String,
    pub budget: u64,
    pub deadline: i64,
    pub currency: String,
    pub category: String,
    pub required_skills: Vec<String>,
    pub status: JobStatus,
    pub visibility: u8,
    pub bids: Vec<Bid>,
    pub freelancer: Option<Pubkey>,
    pub created_at: i64,
    pub updated_at: i64,
    pub completed_at: Option<i64>,
    pub has_milestones: bool,
    pub milestones: Option<Vec<Milestone>>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum JobStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
    Disputed
}

impl Default for JobStatus {
    fn default() -> Self {
        JobStatus::Open
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BidStatus {
    Pending,
    Accepted,
    Rejected
}

impl Default for BidStatus {
    fn default() -> Self {
        BidStatus::Pending
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Milestone {
    pub title: String,
    pub description: String,
    pub amount: u64, // percentage of total budget as basis points (1% = 100)
    pub deadline: i64,
    pub completed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Bid {
    pub bidder: Pubkey,
    pub amount: u64,
    pub completion_time: i64,
    pub proposal: String,
    pub status: BidStatus,
    pub milestones: Option<Vec<Milestone>>,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum JobVisibility {
    Public,
    Private,
    Invitation,
}

// Context for job creation
#[derive(Accounts)]
#[instruction(
    title: String,
    description: String,
    budget: u64,
    deadline: i64,
    currency: String,
    category: String,
    required_skills: Vec<String>,
    visibility: u8
)]
pub struct CreateJob<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(
        init,
        payer = client,
        space = 8 // account discriminator
            + 8 // id
            + 32 // client pubkey
            + 4 + title.len() // title
            + 4 + description.len() // description
            + 8 // budget
            + 8 // deadline
            + 4 + currency.len() // currency
            + 4 + category.len() // category
            + 4 + (required_skills.iter().map(|s| 4 + s.len()).sum::<usize>()) // required_skills
            + 1 // status
            + 1 // visibility
            + 4 + (10 * (32 + 8 + 100 + 8 + 1 + 8 + 4 + 5 * 100)) // bids with milestones
            + 33 // freelancer
            + 8 // created_at
            + 8 // updated_at
            + 9 // completed_at
            + 1 // has_milestones
            + 4 + (5 * (4 + 50 + 4 + 100 + 8 + 8 + 1 + 1)) // milestones
    )]
    pub job: Account<'info, Job>,
    pub system_program: Program<'info, System>,
}

// Context for placing a bid
#[derive(Accounts)]
#[instruction(job_id: u64, bid_amount: u64, completion_time: i64, proposal: String, milestones: Option<Vec<Milestone>>)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    #[account(
        mut,
        constraint = job.id == job_id,
        constraint = job.status == JobStatus::Open,
        constraint = job.deadline > Clock::get().unwrap().unix_timestamp,
    )]
    pub job: Account<'info, Job>,
}

// Context for accepting a bid
#[derive(Accounts)]
#[instruction(job_id: u64, bid_index: u64)]
pub struct AcceptBid<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(
        mut,
        constraint = job.id == job_id,
        constraint = job.client == client.key(),
        constraint = job.status == JobStatus::Open,
        constraint = bid_index < job.bids.len() as u64,
    )]
    pub job: Account<'info, Job>,
}

// Context for cancelling a job
#[derive(Accounts)]
#[instruction(job_id: u64)]
pub struct CancelJob<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(
        mut,
        constraint = job.id == job_id,
        constraint = job.client == client.key(),
        constraint = job.status == JobStatus::Open,
    )]
    pub job: Account<'info, Job>,
}

// Function implementations
pub fn create_job(
    ctx: Context<CreateJob>,
    title: String,
    description: String,
    budget: u64,
    deadline: i64,
    currency: String,
    category: String,
    required_skills: Vec<String>,
    visibility: u8,
) -> Result<()> {
    let job = &mut ctx.accounts.job;
    let client = &ctx.accounts.client;
    let clock = Clock::get()?;

    // Generate job ID (can be replaced with more sophisticated ID generation)
    let job_id = clock.unix_timestamp as u64;

    job.id = job_id;
    job.client = client.key();
    job.title = title;
    job.description = description;
    job.budget = budget;
    job.deadline = deadline;
    job.currency = currency;
    job.category = category;
    job.required_skills = required_skills;
    job.status = JobStatus::Open;
    job.visibility = visibility;
    job.bids = Vec::new();
    job.freelancer = None;
    job.created_at = clock.unix_timestamp;
    job.updated_at = clock.unix_timestamp;
    job.completed_at = None;
    job.has_milestones = false;
    job.milestones = None;

    emit!(JobCreatedEvent {
        job_id,
        client: client.key(),
        title: job.title.clone(),
        budget,
        deadline,
    });

    Ok(())
}

pub fn place_bid(
    ctx: Context<PlaceBid>,
    job_id: u64,
    bid_amount: u64,
    completion_time: i64,
    proposal: String,
    milestones: Option<Vec<Milestone>>,
) -> Result<()> {
    let job = &mut ctx.accounts.job;
    let bidder = &ctx.accounts.bidder;
    let clock = Clock::get()?;

    // Validate bid
    require!(completion_time > clock.unix_timestamp, JobError::InvalidCompletionTime);
    require!(bid_amount > 0, JobError::BidAmountTooLow);

    // Create bid
    let new_bid = Bid {
        bidder: bidder.key(),
        amount: bid_amount,
        proposal,
        completion_time,
        status: BidStatus::Pending,
        created_at: clock.unix_timestamp,
        milestones,
    };

    // Add bid to job
    job.bids.push(new_bid);
    job.updated_at = clock.unix_timestamp;

    emit!(BidPlacedEvent {
        job_id,
        bidder: bidder.key(),
        amount: bid_amount,
        completion_time,
    });

    Ok(())
}

pub fn accept_bid(ctx: Context<AcceptBid>, job_id: u64, bid_index: u64) -> Result<()> {
    let job = &mut ctx.accounts.job;
    let client = &ctx.accounts.client;
    let clock = Clock::get()?;

    // Mark the selected bid as accepted
    job.bids[bid_index as usize].status = BidStatus::Accepted;
    
    // Get the freelancer pubkey from the accepted bid
    let freelancer = job.bids[bid_index as usize].bidder;
    
    // Update job status and details
    job.status = JobStatus::InProgress;
    job.freelancer = Some(freelancer);
    job.updated_at = clock.unix_timestamp;
    
    // If the bid has milestones, update the job milestones
    if let Some(milestones) = &job.bids[bid_index as usize].milestones {
        job.has_milestones = true;
        job.milestones = Some(milestones.clone());
    }
    
    // Mark other bids as rejected
    for i in 0..job.bids.len() {
        if i != bid_index as usize {
            job.bids[i].status = BidStatus::Rejected;
        }
    }

    emit!(BidAcceptedEvent {
        job_id,
        client: client.key(),
        freelancer,
    });

    Ok(())
}

pub fn cancel_job(ctx: Context<CancelJob>, job_id: u64) -> Result<()> {
    let job = &mut ctx.accounts.job;
    let clock = Clock::get()?;

    job.status = JobStatus::Cancelled;
    job.updated_at = clock.unix_timestamp;

    emit!(JobCancelledEvent {
        job_id,
        client: ctx.accounts.client.key(),
    });

    Ok(())
}

// Events
#[event]
pub struct JobCreatedEvent {
    pub job_id: u64,
    pub client: Pubkey,
    pub title: String,
    pub budget: u64,
    pub deadline: i64,
}

#[event]
pub struct BidPlacedEvent {
    pub job_id: u64,
    pub bidder: Pubkey,
    pub amount: u64,
    pub completion_time: i64,
}

#[event]
pub struct BidAcceptedEvent {
    pub job_id: u64,
    pub client: Pubkey,
    pub freelancer: Pubkey,
}

#[event]
pub struct JobCancelledEvent {
    pub job_id: u64,
    pub client: Pubkey,
}

// Error Codes
#[error_code]
pub enum JobError {
    #[msg("Job ID does not match")]
    JobIdMismatch,
    #[msg("Job is not open")]
    JobNotOpen,
    #[msg("Job deadline has passed")]
    JobDeadlinePassed,
    #[msg("Only the client can cancel a job")]
    UnauthorizedCancellation,
    #[msg("Invalid completion time")]
    InvalidCompletionTime,
    #[msg("Bid amount is too low")]
    BidAmountTooLow,
    #[msg("Invalid bid index")]
    InvalidBidIndex,
} 