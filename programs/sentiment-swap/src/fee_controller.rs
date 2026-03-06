use anchor_lang::prelude::*;
use crate::{PoolState, SentimentState};

// ── Fee Tiers ─────────────────────────────────────────────
pub const FEE_EXTREME_FEAR: u64 = 5;    // 0.05% — encourage trading
pub const FEE_FEAR: u64 = 15;           // 0.15%
pub const FEE_NEUTRAL: u64 = 30;        // 0.30% — standard
pub const FEE_GREED: u64 = 50;          // 0.50%
pub const FEE_EXTREME_GREED: u64 = 100; // 1.00% — protect LPs

// ── Update Pool Fee Based on Sentiment ───────────────────
pub fn sync_pool_fee(
    ctx: Context<SyncPoolFee>,
) -> Result<()> {
    let sentiment_score = ctx.accounts.sentiment_state.score;
    let pool = &mut ctx.accounts.pool_state;

    let new_fee = get_fee_for_score(sentiment_score);
    let old_fee = pool.fee_bps;

    pool.fee_bps = new_fee;
    pool.sentiment_score = sentiment_score;

    emit!(FeeUpdated {
        old_fee,
        new_fee,
        sentiment_score,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!(
        "Fee synced: {}bps → {}bps (sentiment: {})",
        old_fee, new_fee, sentiment_score
    );

    Ok(())
}

// ── Core Fee Calculation ──────────────────────────────────
pub fn get_fee_for_score(score: u8) -> u64 {
    match score {
        0..=20  => FEE_EXTREME_FEAR,
        21..=40 => FEE_FEAR,
        41..=60 => FEE_NEUTRAL,
        61..=80 => FEE_GREED,
        _       => FEE_EXTREME_GREED,
    }
}

// ── Fee Info for Frontend ─────────────────────────────────
pub fn get_fee_info(score: u8) -> FeeInfo {
    FeeInfo {
        fee_bps: get_fee_for_score(score),
        label: get_fee_label(score),
        sentiment_label: get_sentiment_label(score),
        score,
    }
}

fn get_fee_label(score: u8) -> &'static str {
    match score {
        0..=20  => "0.05%",
        21..=40 => "0.15%",
        41..=60 => "0.30%",
        61..=80 => "0.50%",
        _       => "1.00%",
    }
}

fn get_sentiment_label(score: u8) -> &'static str {
    match score {
        0..=20  => "Extreme Fear 😱",
        21..=40 => "Fear 😨",
        41..=60 => "Neutral 😐",
        61..=80 => "Greed 🤑",
        _       => "Extreme Greed 🚀",
    }
}

// ── Fee Info Struct ───────────────────────────────────────
pub struct FeeInfo {
    pub fee_bps: u64,
    pub label: &'static str,
    pub sentiment_label: &'static str,
    pub score: u8,
}

// ── Account Context ───────────────────────────────────────
#[derive(Accounts)]
pub struct SyncPoolFee<'info> {
    #[account(mut)]
    pub pool_state: Account<'info, PoolState>,
    pub sentiment_state: Account<'info, SentimentState>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

// ── Events ────────────────────────────────────────────────
#[event]
pub struct FeeUpdated {
    pub old_fee: u64,
    pub new_fee: u64,
    pub sentiment_score: u8,
    pub timestamp: i64,
}