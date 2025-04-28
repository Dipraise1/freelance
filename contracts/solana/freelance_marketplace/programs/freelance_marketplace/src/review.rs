use anchor_lang::prelude::*;
use crate::job::{Job, JobStatus};
use crate::profile::Profile;

#[account]
pub struct Review {
    pub reviewer: Pubkey,
    pub target_user: Pubkey,
    pub job_id: u64,
    pub rating: u8,
    pub comment: String,
    pub created_at: i64,
}

#[derive(Accounts)]
#[instruction(target_user: Pubkey, job_id: u64, rating: u8, comment: String)]
pub struct CreateReview<'info> {
    #[account(mut)]
    pub reviewer: Signer<'info>,
    #[account(
        mut,
        constraint = job.id == job_id,
        constraint = job.status == JobStatus::Completed,
        constraint = job.client == reviewer.key() || job.freelancer.unwrap() == reviewer.key()
    )]
    pub job: Account<'info, Job>,
    #[account(
        init,
        payer = reviewer,
        space = 8 // account discriminator
            + 32 // reviewer pubkey
            + 32 // target user pubkey
            + 8  // job id
            + 1  // rating
            + 4 + comment.len() // comment
            + 8  // created_at
    )]
    pub review: Account<'info, Review>,
    #[account(
        mut,
        constraint = profile.owner == target_user
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct ReviewCreatedEvent {
    pub reviewer: Pubkey,
    pub target_user: Pubkey,
    pub job_id: u64,
    pub rating: u8,
}

pub fn create_review(
    ctx: Context<CreateReview>,
    target_user: Pubkey,
    job_id: u64,
    rating: u8,
    comment: String
) -> Result<()> {
    let review = &mut ctx.accounts.review;
    let reviewer = &ctx.accounts.reviewer;
    let profile = &mut ctx.accounts.profile;
    let clock = Clock::get()?;
    
    // Validate rating (1-5 scale)
    if rating < 1 || rating > 5 {
        return Err(ReviewError::InvalidRating.into());
    }
    
    // Validate that you're not reviewing yourself
    if reviewer.key() == target_user {
        return Err(ReviewError::SelfReview.into());
    }
    
    // Set review data
    review.reviewer = reviewer.key();
    review.target_user = target_user;
    review.job_id = job_id;
    review.rating = rating;
    review.comment = comment;
    review.created_at = clock.unix_timestamp;
    
    // Update profile reputation if applicable
    // This is a simple implementation - in a real system you might
    // want to use a weighted average or more sophisticated algorithm
    let existing_score = profile.reputation_score.unwrap_or(0);
    if existing_score == 0 {
        profile.reputation_score = Some(rating);
    } else {
        // Simple average: (old_score + new_rating) / 2
        let new_score = (existing_score as u16 + rating as u16) / 2;
        profile.reputation_score = Some(new_score as u8);
    }
    
    // Emit review created event
    emit!(ReviewCreatedEvent {
        reviewer: reviewer.key(),
        target_user,
        job_id,
        rating,
    });
    
    Ok(())
}

#[error_code]
pub enum ReviewError {
    #[msg("Invalid rating. Must be between 1-5")]
    InvalidRating,
    #[msg("Cannot review yourself")]
    SelfReview,
    #[msg("Job not completed yet")]
    JobNotCompleted,
    #[msg("Not authorized to review this job")]
    NotAuthorized,
} 