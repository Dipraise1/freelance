use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::associated_token;
use job::{Job, JobStatus, CancelJob, CreateJob, PlaceBid, AcceptBid, Milestone};
use escrow::{Escrow, CreateEscrow, ReleaseEscrow, ReleaseMilestonePayment, RefundEscrow, MilestonePayment};
use dispute::{Dispute, InitiateDispute, ResolveDispute};
use portfolio::{Portfolio, CreatePortfolio, UpdatePortfolio};
use review::{Review, CreateReview};
use profile::{Profile, CreateProfile, UpdateProfile};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod job;
pub mod escrow;
pub mod profile;
pub mod dispute;
pub mod portfolio;
pub mod review;

use job::*;
use escrow::*;
use profile::*;
use dispute::*;
use portfolio::*;

#[program]
pub mod freelance_marketplace {
    use super::*;

    // Job Module Functions
    pub fn create_job(
        ctx: Context<CreateJob>,
        title: String,
        description: String,
        budget: u64,
        deadline: i64,
        category: String,
        skills: Vec<String>,
        has_milestones: bool,
        milestones: Option<Vec<Milestone>>
    ) -> Result<()> {
        job::create_job(
            ctx, 
            title, 
            description, 
            budget, 
            deadline, 
            category, 
            skills,
            has_milestones,
            milestones
        )
    }

    pub fn place_bid(
        ctx: Context<PlaceBid>,
        job_id: u64,
        amount: u64,
        description: String,
        deadline: i64,
        milestones: Option<Vec<Milestone>>
    ) -> Result<()> {
        job::place_bid(ctx, job_id, amount, description, deadline, milestones)
    }

    pub fn accept_bid(
        ctx: Context<AcceptBid>,
        job_id: u64,
        bid_index: u8
    ) -> Result<()> {
        job::accept_bid(ctx, job_id, bid_index)
    }

    pub fn cancel_job(
        ctx: Context<CancelJob>,
        job_id: u64
    ) -> Result<()> {
        job::cancel_job(ctx, job_id)
    }

    // Escrow Module Functions
    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        amount: u64,
        token_mint: Option<Pubkey>,
    ) -> Result<()> {
        escrow::create_escrow(ctx, amount, token_mint)
    }

    pub fn release_escrow(
        ctx: Context<ReleaseEscrow>,
        job_id: u64
    ) -> Result<()> {
        escrow::release_escrow(ctx, job_id)
    }

    pub fn milestone_payment(
        ctx: Context<MilestonePayment>,
        job_id: u64,
        milestone_index: u8
    ) -> Result<()> {
        escrow::milestone_payment(ctx, job_id, milestone_index)
    }

    pub fn refund_escrow(
        ctx: Context<RefundEscrow>,
        job_id: u64
    ) -> Result<()> {
        escrow::refund_escrow(ctx, job_id)
    }

    // Profile Module Functions
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        profile_type: ProfileType,
        username: String,
        name: String,
        bio: String,
        skills: Option<Vec<String>>,
        hourly_rate: Option<u64>
    ) -> Result<()> {
        profile::create_profile(ctx, profile_type, username, name, bio, skills, hourly_rate)
    }

    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        name: Option<String>,
        bio: Option<String>,
        skills: Option<Vec<String>>,
        hourly_rate: Option<u64>
    ) -> Result<()> {
        profile::update_profile(ctx, name, bio, skills, hourly_rate)
    }

    // Dispute Module Functions
    pub fn create_dispute(
        ctx: Context<CreateDispute>,
        job_id: u64,
        reason: String,
        evidence: String
    ) -> Result<()> {
        dispute::create_dispute(ctx, job_id, reason, evidence)
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        dispute_id: u64,
        resolution_type: ResolutionType,
        resolution_note: String,
        client_percentage: u8,
        freelancer_percentage: u8
    ) -> Result<()> {
        dispute::resolve_dispute(ctx, dispute_id, resolution_type, resolution_note, client_percentage, freelancer_percentage)
    }

    // Portfolio Module Functions
    pub fn create_portfolio_item(
        ctx: Context<CreatePortfolioItem>,
        title: String,
        description: String,
        image_url: String,
        tags: Vec<String>
    ) -> Result<()> {
        portfolio::create_portfolio_item(ctx, title, description, image_url, tags)
    }

    pub fn update_portfolio_item(
        ctx: Context<UpdatePortfolioItem>,
        portfolio_id: u64,
        title: Option<String>,
        description: Option<String>,
        image_url: Option<String>,
        tags: Option<Vec<String>>
    ) -> Result<()> {
        portfolio::update_portfolio_item(ctx, portfolio_id, title, description, image_url, tags)
    }

    pub fn delete_portfolio_item(
        ctx: Context<DeletePortfolioItem>,
        portfolio_id: u64
    ) -> Result<()> {
        portfolio::delete_portfolio_item(ctx, portfolio_id)
    }

    // Review Module
    pub fn create_review(
        ctx: Context<CreateReview>,
        target_user: Pubkey,
        job_id: u64,
        rating: u8,
        comment: String,
    ) -> Result<()> {
        review::create_review(ctx, target_user, job_id, rating, comment)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
