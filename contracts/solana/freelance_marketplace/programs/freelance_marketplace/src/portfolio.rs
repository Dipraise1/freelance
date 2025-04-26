use anchor_lang::prelude::*;
use crate::job::{Job, JobStatus};

#[account]
pub struct Portfolio {
    pub freelancer: Pubkey,
    pub skills: Vec<String>,
    pub past_projects: Vec<String>,
    pub completed_jobs: Vec<u64>,
    pub rating: Option<u8>,
    pub reviews: Vec<Review>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Review {
    pub job_id: u64,
    pub client: Pubkey,
    pub rating: u8,
    pub comment: String,
    pub timestamp: i64,
}

#[derive(Accounts)]
#[instruction(skills: Vec<String>, past_projects: Vec<String>)]
pub struct CreatePortfolio<'info> {
    #[account(
        init,
        payer = freelancer,
        space = 8 + 32 + 4 + 200 + 4 + 500 + 4 + 100 + 1 + 1 + 4 + 1000 + 8 + 8
    )]
    pub portfolio: Account<'info, Portfolio>,
    #[account(mut)]
    pub freelancer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(skills: Vec<String>, past_projects: Vec<String>)]
pub struct UpdatePortfolio<'info> {
    #[account(mut, has_one = freelancer)]
    pub portfolio: Account<'info, Portfolio>,
    #[account(mut)]
    pub freelancer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(job_id: u64)]
pub struct AddJobToPortfolio<'info> {
    #[account(mut, has_one = freelancer)]
    pub portfolio: Account<'info, Portfolio>,
    #[account(
        constraint = job.job_id == job_id,
        constraint = job.status == JobStatus::Completed,
        constraint = job.selected_freelancer.unwrap() == freelancer.key()
    )]
    pub job: Account<'info, Job>,
    #[account(mut)]
    pub freelancer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_portfolio(
    ctx: Context<CreatePortfolio>,
    skills: Vec<String>,
    past_projects: Vec<String>,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio;
    let clock = Clock::get()?;
    
    portfolio.freelancer = *ctx.accounts.freelancer.key;
    portfolio.skills = skills;
    portfolio.past_projects = past_projects;
    portfolio.completed_jobs = vec![];
    portfolio.rating = None;
    portfolio.reviews = vec![];
    portfolio.created_at = clock.unix_timestamp;
    portfolio.updated_at = clock.unix_timestamp;
    
    Ok(())
}

pub fn update_portfolio(
    ctx: Context<UpdatePortfolio>,
    skills: Vec<String>,
    past_projects: Vec<String>,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio;
    let clock = Clock::get()?;
    
    portfolio.skills = skills;
    portfolio.past_projects = past_projects;
    portfolio.updated_at = clock.unix_timestamp;
    
    Ok(())
}

pub fn add_job_to_portfolio(
    ctx: Context<AddJobToPortfolio>,
    job_id: u64,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio;
    
    // Check if job is already added
    if !portfolio.completed_jobs.contains(&job_id) {
        portfolio.completed_jobs.push(job_id);
        portfolio.updated_at = Clock::get()?.unix_timestamp;
    }
    
    Ok(())
}

// Additional functions for future implementation
// - Add review to portfolio
// - Calculate average rating 