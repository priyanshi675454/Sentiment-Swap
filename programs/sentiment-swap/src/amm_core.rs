use anchor_lang::prelude::*;
use crate::{PoolState, SentimentState};

pub fn initialize_pool(
    ctx: Context<InitializePool>,
    token_a_amount: u64,
    token_b_amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool_state;
    pool.authority = ctx.accounts.authority.key();
    pool.token_a_mint = ctx.accounts.token_a_mint.key();
    pool.token_b_mint = ctx.accounts.token_b_mint.key();
    pool.token_a_reserve = token_a_amount;
    pool.token_b_reserve = token_b_amount;
    // Use simple geometric mean without integer_sqrt
    pool.lp_supply = token_a_amount.min(token_b_amount);
    pool.fee_bps = 30;
    pool.sentiment_score = 50;
    pool.bump = ctx.bumps.pool_state;
    msg!("Pool initialized: {} / {}", token_a_amount, token_b_amount);
    Ok(())
}

pub fn add_liquidity(
    ctx: Context<AddLiquidity>,
    amount_a: u64,
    amount_b: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool_state;
    require!(amount_a > 0 && amount_b > 0, AmmError::ZeroAmount);

    let lp_minted = if pool.lp_supply == 0 {
        amount_a.min(amount_b)
    } else {
        let lp_a = (amount_a as u128 * pool.lp_supply as u128
            / pool.token_a_reserve as u128) as u64;
        let lp_b = (amount_b as u128 * pool.lp_supply as u128
            / pool.token_b_reserve as u128) as u64;
        lp_a.min(lp_b)
    };

    pool.token_a_reserve = pool.token_a_reserve
        .checked_add(amount_a).ok_or(AmmError::Overflow)?;
    pool.token_b_reserve = pool.token_b_reserve
        .checked_add(amount_b).ok_or(AmmError::Overflow)?;
    pool.lp_supply = pool.lp_supply
        .checked_add(lp_minted).ok_or(AmmError::Overflow)?;

    msg!("Liquidity added. LP minted: {}", lp_minted);
    Ok(())
}

pub fn remove_liquidity(
    ctx: Context<RemoveLiquidity>,
    lp_amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool_state;
    require!(lp_amount > 0, AmmError::ZeroAmount);
    require!(lp_amount <= pool.lp_supply, AmmError::InsufficientLiquidity);

    let amount_a = (lp_amount as u128 * pool.token_a_reserve as u128
        / pool.lp_supply as u128) as u64;
    let amount_b = (lp_amount as u128 * pool.token_b_reserve as u128
        / pool.lp_supply as u128) as u64;

    pool.token_a_reserve = pool.token_a_reserve
        .checked_sub(amount_a).ok_or(AmmError::Overflow)?;
    pool.token_b_reserve = pool.token_b_reserve
        .checked_sub(amount_b).ok_or(AmmError::Overflow)?;
    pool.lp_supply = pool.lp_supply
        .checked_sub(lp_amount).ok_or(AmmError::Overflow)?;

    msg!("Liquidity removed. A: {}, B: {}", amount_a, amount_b);
    Ok(())
}

pub fn swap(
    ctx: Context<Swap>,
    amount_in: u64,
    minimum_amount_out: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool_state;
    let sentiment = &ctx.accounts.sentiment_state;
    require!(amount_in > 0, AmmError::ZeroAmount);

    // 🧠 Sentiment-driven fee
    let fee_bps = calculate_fee_from_sentiment(sentiment.score);
    pool.fee_bps = fee_bps;

    let fee_amount = (amount_in as u128 * fee_bps as u128 / 10000) as u64;
    let amount_in_after_fee = amount_in
        .checked_sub(fee_amount).ok_or(AmmError::Overflow)?;

    // x * y = k
    let amount_out = (pool.token_b_reserve as u128
        * amount_in_after_fee as u128
        / (pool.token_a_reserve as u128 + amount_in_after_fee as u128)) as u64;

    require!(amount_out >= minimum_amount_out, AmmError::SlippageExceeded);
    require!(amount_out < pool.token_b_reserve, AmmError::InsufficientLiquidity);

    pool.token_a_reserve = pool.token_a_reserve
        .checked_add(amount_in_after_fee).ok_or(AmmError::Overflow)?;
    pool.token_b_reserve = pool.token_b_reserve
        .checked_sub(amount_out).ok_or(AmmError::Overflow)?;

    msg!("Swap: {} in → {} out | fee: {}bps | sentiment: {}",
        amount_in, amount_out, fee_bps, sentiment.score);
    Ok(())
}

pub fn calculate_fee_from_sentiment(score: u8) -> u64 {
    match score {
        0..=20  => 5,
        21..=40 => 15,
        41..=60 => 30,
        61..=80 => 50,
        _       => 100,
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 1 + 1,
        seeds = [b"pool",
            token_a_mint.key().as_ref(),
            token_b_mint.key().as_ref()],
        bump
    )]
    pub pool_state: Account<'info, PoolState>,
    /// CHECK: mint a
    pub token_a_mint: UncheckedAccount<'info>,
    /// CHECK: mint b
    pub token_b_mint: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool_state: Account<'info, PoolState>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(mut)]
    pub pool_state: Account<'info, PoolState>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub pool_state: Account<'info, PoolState>,
    pub sentiment_state: Account<'info, SentimentState>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[error_code]
pub enum AmmError {
    #[msg("Amount cannot be zero")]
    ZeroAmount,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
}