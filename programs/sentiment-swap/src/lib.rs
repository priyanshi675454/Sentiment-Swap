use anchor_lang::prelude::*;

pub mod amm_core;
pub mod sentiment_oracle;
pub mod fee_controller;

use amm_core::*;
use sentiment_oracle::*;
use fee_controller::*;

declare_id!("EsKpeQxkgdUn8wHeftVmgKLXRa4wM9ThoeTabLiCUmXx");

#[program]
pub mod sentiment_swap {
    use super::*;

    // Initialize a new liquidity pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        token_a_amount: u64,
        token_b_amount: u64,
    ) -> Result<()> {
        amm_core::initialize_pool(ctx, token_a_amount, token_b_amount)
    }

    // Add liquidity to existing pool
    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_a: u64,
        amount_b: u64,
    ) -> Result<()> {
        amm_core::add_liquidity(ctx, amount_a, amount_b)
    }

    // Remove liquidity from pool
    pub fn remove_liquidity(
        ctx: Context<RemoveLiquidity>,
        lp_amount: u64,
    ) -> Result<()> {
        amm_core::remove_liquidity(ctx, lp_amount)
    }

    // Swap tokens — fee is dynamically set by sentiment
    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        amm_core::swap(ctx, amount_in, minimum_amount_out)
    }

    // Update the sentiment score on-chain
    pub fn update_sentiment(
        ctx: Context<UpdateSentiment>,
        volume_24h: u64,
        price_change: i64,
        active_wallets: u64,
    ) -> Result<()> {
        sentiment_oracle::update_sentiment(ctx, volume_24h, price_change, active_wallets)
    }
}

// ── Global State ──────────────────────────────────────────
#[account]
pub struct PoolState {
    pub authority: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub token_a_reserve: u64,
    pub token_b_reserve: u64,
    pub lp_supply: u64,
    pub fee_bps: u64,        // fee in basis points (e.g. 30 = 0.30%)
    pub sentiment_score: u8, // 0-100 (0=extreme fear, 100=extreme greed)
    pub bump: u8,
}

#[account]
pub struct SentimentState {
    pub score: u8,           // 0 = extreme fear, 100 = extreme greed
    pub last_updated: i64,
    pub volume_24h: u64,
    pub price_change: i64,
    pub active_wallets: u64,
    pub bump: u8,
}