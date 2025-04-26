use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

mod job;
mod escrow;
mod dispute;
mod portfolio;

use job::*;
use escrow::*;
use dispute::*;
use portfolio::*;

#[program]
pub mod freelance_marketplace {
    use super::*;

    // Job related functions
    pub fn create_job(
        ctx: Context<CreateJob>,
        job_id: u64,
        title: String,
        description: String,
        budget: u64,
        deadline: i64,
        currency: String,
    ) -> Result<()> {
        job::create_job(ctx, job_id, title, description, budget, deadline, currency)
    }

    pub fn place_bid(
        ctx: Context<PlaceBid>,
        job_id: u64,
        bid_amount: u64,
        proposal: String,
        timeline: i64,
    ) -> Result<()> {
        job::place_bid(ctx, job_id, bid_amount, proposal, timeline)
    }

    pub fn accept_bid(ctx: Context<AcceptBid>, job_id: u64, freelancer: Pubkey) -> Result<()> {
        job::accept_bid(ctx, job_id, freelancer)
    }

    // Escrow related functions
    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        job_id: u64,
        amount: u64,
    ) -> Result<()> {
        escrow::create_escrow(ctx, job_id, amount)
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>, job_id: u64) -> Result<()> {
        escrow::release_escrow(ctx, job_id)
    }

    // Dispute related functions
    pub fn initiate_dispute(
        ctx: Context<InitiateDispute>,
        job_id: u64,
        reason: String,
        evidence_ipfs: String,
    ) -> Result<()> {
        dispute::initiate_dispute(ctx, job_id, reason, evidence_ipfs)
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        job_id: u64,
        release_to_freelancer: bool,
        split_ratio: u64,
    ) -> Result<()> {
        dispute::resolve_dispute(ctx, job_id, release_to_freelancer, split_ratio)
    }

    // Portfolio related functions
    pub fn create_portfolio(
        ctx: Context<CreatePortfolio>,
        skills: Vec<String>,
        past_projects: Vec<String>,
    ) -> Result<()> {
        portfolio::create_portfolio(ctx, skills, past_projects)
    }

    pub fn update_portfolio(
        ctx: Context<UpdatePortfolio>,
        skills: Vec<String>,
        past_projects: Vec<String>,
    ) -> Result<()> {
        portfolio::update_portfolio(ctx, skills, past_projects)
    }

    pub fn add_job_to_portfolio(ctx: Context<AddJobToPortfolio>, job_id: u64) -> Result<()> {
        portfolio::add_job_to_portfolio(ctx, job_id)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
