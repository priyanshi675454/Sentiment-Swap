use anchor_lang::prelude::*;
use crate::SentimentState;

pub fn update_sentiment(
    ctx: Context<UpdateSentiment>,
    volume_24h: u64,
    price_change: i64,
    active_wallets: u64,
) -> Result<()> {
    let sentiment = &mut ctx.accounts.sentiment_state;

    let volume_score = calculate_volume_score(volume_24h);
    let price_score = calculate_price_score(price_change);
    let wallet_score = calculate_wallet_score(active_wallets);

    let final_score = (
        (volume_score as u32 * 40) +
        (price_score as u32 * 40) +
        (wallet_score as u32 * 20)
    ) / 100;

    sentiment.score = final_score as u8;
    sentiment.last_updated = Clock::get()?.unix_timestamp;
    sentiment.volume_24h = volume_24h;
    sentiment.price_change = price_change;
    sentiment.active_wallets = active_wallets;

    emit!(SentimentUpdated {
        score: sentiment.score,
        volume_score,
        price_score,
        wallet_score,
        timestamp: sentiment.last_updated,
    });

    msg!("Sentiment: score={}", sentiment.score);
    Ok(())
}

fn calculate_volume_score(volume_24h: u64) -> u8 {
    match volume_24h {
        0..=1_000_000             => 10,
        1_000_001..=10_000_000    => 25,
        10_000_001..=50_000_000   => 45,
        50_000_001..=100_000_000  => 60,
        100_000_001..=500_000_000 => 75,
        _                         => 90,
    }
}

fn calculate_price_score(price_change: i64) -> u8 {
    if price_change <= -20      { 5  }
    else if price_change <= -10 { 20 }
    else if price_change <= -3  { 35 }
    else if price_change <= 2   { 50 }
    else if price_change <= 9   { 65 }
    else if price_change <= 19  { 80 }
    else                        { 95 }
}

fn calculate_wallet_score(active_wallets: u64) -> u8 {
    match active_wallets {
        0..=100        => 15,
        101..=500      => 30,
        501..=2_000    => 50,
        2_001..=10_000 => 65,
        10_001..=50_000 => 80,
        _              => 95,
    }
}

#[derive(Accounts)]
pub struct UpdateSentiment<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + 1 + 8 + 8 + 8 + 8 + 1,
        seeds = [b"sentiment"],
        bump
    )]
    pub sentiment_state: Account<'info, SentimentState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct SentimentUpdated {
    pub score: u8,
    pub volume_score: u8,
    pub price_score: u8,
    pub wallet_score: u8,
    pub timestamp: i64,
}