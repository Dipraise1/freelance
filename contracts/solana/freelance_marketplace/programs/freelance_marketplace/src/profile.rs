use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProfileType {
    Client,
    Freelancer,
    Admin
}

impl Default for ProfileType {
    fn default() -> Self {
        ProfileType::Client
    }
}

#[account]
pub struct Profile {
    pub owner: Pubkey,
    pub profile_type: ProfileType,
    pub username: String,
    pub name: String,
    pub bio: String,
    pub skills: Option<Vec<String>>,
    pub hourly_rate: Option<u64>,
    pub jobs_completed: u32,
    pub jobs_posted: u32,
    pub reputation_score: Option<u8>,
    pub created_at: i64,
    pub updated_at: i64,
    pub is_verified: bool,
}

#[derive(Accounts)]
#[instruction(
    profile_type: ProfileType,
    username: String,
    name: String,
    bio: String,
    skills: Option<Vec<String>>,
    hourly_rate: Option<u64>
)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 // account discriminator
            + 32 // owner pubkey
            + 1  // profile type
            + 4 + username.len() // username
            + 4 + name.len() // name
            + 4 + bio.len() // bio
            + 4 + (skills.as_ref().map_or(0, |s| s.iter().map(|skill| 4 + skill.len()).sum::<usize>())) // skills
            + 9 // hourly rate (Option<u64>)
            + 4 // jobs completed
            + 4 // jobs posted
            + 2 // reputation score (Option<u8>)
            + 8 // created_at
            + 8 // updated_at
            + 1 // is_verified
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = profile.owner == owner.key(),
    )]
    pub profile: Account<'info, Profile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetProfile<'info> {
    pub profile: Account<'info, Profile>,
}

#[event]
pub struct ProfileCreatedEvent {
    pub owner: Pubkey,
    pub profile_type: ProfileType,
    pub username: String,
}

#[event]
pub struct ProfileUpdatedEvent {
    pub owner: Pubkey,
    pub username: String,
}

pub fn create_profile(
    ctx: Context<CreateProfile>,
    profile_type: ProfileType,
    username: String,
    name: String,
    bio: String,
    skills: Option<Vec<String>>,
    hourly_rate: Option<u64>
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let owner = &ctx.accounts.owner;
    let clock = Clock::get()?;

    // Validate username (add more validation if needed)
    if username.len() < 3 || username.len() > 20 {
        return Err(ProfileError::InvalidUsername.into());
    }

    profile.owner = owner.key();
    profile.profile_type = profile_type;
    profile.username = username.clone();
    profile.name = name;
    profile.bio = bio;
    profile.skills = skills;
    profile.hourly_rate = hourly_rate;
    profile.jobs_completed = 0;
    profile.jobs_posted = 0;
    profile.reputation_score = None;
    profile.created_at = clock.unix_timestamp;
    profile.updated_at = clock.unix_timestamp;
    profile.is_verified = false;

    // Emit profile created event
    emit!(ProfileCreatedEvent {
        owner: owner.key(),
        profile_type: profile_type,
        username: username,
    });

    Ok(())
}

pub fn update_profile(
    ctx: Context<UpdateProfile>,
    name: Option<String>,
    bio: Option<String>,
    skills: Option<Vec<String>>,
    hourly_rate: Option<u64>
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let clock = Clock::get()?;

    // Update fields if provided
    if let Some(new_name) = name {
        profile.name = new_name;
    }

    if let Some(new_bio) = bio {
        profile.bio = new_bio;
    }

    if let Some(new_skills) = skills {
        profile.skills = Some(new_skills);
    }

    if let Some(new_hourly_rate) = hourly_rate {
        profile.hourly_rate = Some(new_hourly_rate);
    }

    profile.updated_at = clock.unix_timestamp;

    // Emit profile updated event
    emit!(ProfileUpdatedEvent {
        owner: profile.owner,
        username: profile.username.clone(),
    });

    Ok(())
}

// Helper functions
pub fn increment_jobs_completed(profile: &mut Account<Profile>) -> Result<()> {
    profile.jobs_completed += 1;
    profile.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

pub fn increment_jobs_posted(profile: &mut Account<Profile>) -> Result<()> {
    profile.jobs_posted += 1;
    profile.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

pub fn update_reputation_score(profile: &mut Account<Profile>, new_score: u8) -> Result<()> {
    // Ensure score is between 1-5
    if new_score < 1 || new_score > 5 {
        return Err(ProfileError::InvalidReputationScore.into());
    }
    
    profile.reputation_score = Some(new_score);
    profile.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

#[error_code]
pub enum ProfileError {
    #[msg("Invalid username length. Must be between 3-20 characters")]
    InvalidUsername,
    #[msg("Invalid reputation score. Must be between 1-5")]
    InvalidReputationScore,
    #[msg("Profile not found")]
    ProfileNotFound,
    #[msg("Unauthorized update")]
    UnauthorizedUpdate,
} 