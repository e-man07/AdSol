use anchor_lang::prelude::*;

declare_id!("5JFj9EFPa45pycaUmR8GwdzNXjZqZQ5ZQ3n6ndhQPYse");

// Export the AdSlot struct for other programs to use
pub mod ad_marketplace_structs {
    pub use super::AdSlot;
}

#[program]
pub mod ad_marketplace {
    use super::*;

    pub fn create_ad_slot(
        ctx: Context<CreateAdSlot>,
        slot_id: String,
        price: u64,
        duration: u64,
        is_auction: bool,
        auction_end: i64,
        category: String,
        audience_size: u64,
    ) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        ad_slot.owner = *ctx.accounts.owner.key;
        ad_slot.slot_id = slot_id.clone();
        ad_slot.price = price;
        ad_slot.duration = duration;
        ad_slot.is_auction = is_auction;
        ad_slot.auction_end = if is_auction { auction_end } else { 0 };
        ad_slot.highest_bid = 0;
        ad_slot.highest_bidder = if is_auction { Pubkey::default() } else { *ctx.accounts.owner.key };
        ad_slot.is_active = true;
        ad_slot.view_count = 0;
        ad_slot.category = category;
        ad_slot.audience_size = audience_size;
        
        emit!(SlotCreated {
            slot_id: slot_id.clone(),
            owner: ad_slot.owner,
        });
        Ok(())
    }

    pub fn create_ad(
        ctx: Context<CreateAd>,
        ad_id: String,
        media_cid: String,
    ) -> Result<()> {
        let ad = &mut ctx.accounts.ad;
        ad.owner = *ctx.accounts.owner.key;
        ad.ad_id = ad_id;
        ad.media_cid = media_cid;
        ad.slot_key = ctx.accounts.slot.key();
        
        emit!(AdCreated {
            ad_id: ad.ad_id.clone(),
            owner: ad.owner,
        });
        Ok(())
    }

    pub fn buy_fixed_price(ctx: Context<BuyFixedPrice>) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        require!(!ad_slot.is_auction, ErrorCode::InvalidPurchaseType);
        require!(ad_slot.is_active, ErrorCode::SlotNotActive);
        
        ad_slot.is_active = false;
        ad_slot.highest_bidder = *ctx.accounts.buyer.key;
        
        emit!(SlotPurchased {
            slot_id: ad_slot.slot_id.clone(),
            buyer: *ctx.accounts.buyer.key,
        });
        Ok(())
    }

    pub fn place_bid(ctx: Context<PlaceBid>, bid_amount: u64) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        let clock = Clock::get()?;
        
        require!(ad_slot.is_auction, ErrorCode::InvalidPurchaseType);
        require!(ad_slot.is_active, ErrorCode::SlotNotActive);
        require!(clock.unix_timestamp < ad_slot.auction_end, ErrorCode::AuctionEnded);
        require!(bid_amount > ad_slot.highest_bid, ErrorCode::BidTooLow);

        ad_slot.highest_bid = bid_amount;
        ad_slot.highest_bidder = *ctx.accounts.bidder.key;
        
        emit!(BidPlaced {
            slot_id: ad_slot.slot_id.clone(),
            bidder: *ctx.accounts.bidder.key,
            amount: bid_amount,
        });
        Ok(())
    }

    pub fn close_auction(ctx: Context<CloseAuction>) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        let clock = Clock::get()?;
        
        require!(ad_slot.is_auction, ErrorCode::InvalidPurchaseType);
        require!(clock.unix_timestamp >= ad_slot.auction_end, ErrorCode::AuctionNotEnded);
        
        ad_slot.is_active = false;
        
        emit!(AuctionClosed {
            slot_id: ad_slot.slot_id.clone(),
            winner: ad_slot.highest_bidder,
        });
        Ok(())
    }

    pub fn deactivate_slot(ctx: Context<DeactivateSlot>) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        
        require!(ad_slot.is_active, ErrorCode::SlotNotActive);
        require!(ad_slot.owner == *ctx.accounts.owner.key, ErrorCode::Unauthorized);
        
        ad_slot.is_active = false;
        Ok(())
    }

    pub fn increment_view(ctx: Context<IncrementView>) -> Result<()> {
        let ad_slot = &mut ctx.accounts.ad_slot;
        ad_slot.view_count += 1;
        Ok(())
    }
}

#[account]
pub struct AdSlot {
    pub owner: Pubkey,           // 32 bytes
    pub slot_id: String,         // 4 + max_len bytes
    pub price: u64,              // 8 bytes
    pub duration: u64,           // 8 bytes
    pub is_auction: bool,        // 1 byte
    pub auction_end: i64,        // 8 bytes
    pub highest_bid: u64,        // 8 bytes
    pub highest_bidder: Pubkey,  // 32 bytes
    pub is_active: bool,         // 1 byte
    pub view_count: u64,         // 8 bytes
    pub category: String,        // 4 + max_len bytes
    pub audience_size: u64,      // 8 bytes
}

#[account]
pub struct Ad {
    pub owner: Pubkey,       // 32 bytes
    pub ad_id: String,       // 4 + max_len bytes
    pub media_cid: String,   // 4 + max_len bytes
    pub slot_key: Pubkey,    // 32 bytes
}

#[derive(Accounts)]
#[instruction(slot_id: String, category: String)]
pub struct CreateAdSlot<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + // discriminator
                32 + // owner
                4 + slot_id.len() + // slot_id
                8 + // price
                8 + // duration
                1 + // is_auction
                8 + // auction_end
                8 + // highest_bid
                32 + // highest_bidder
                1 + // is_active
                8 + // view_count
                4 + category.len() + // category
                8 // audience_size
    )]
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ad_id: String, media_cid: String)]
pub struct CreateAd<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + // discriminator
                32 + // owner
                4 + ad_id.len() + // ad_id
                4 + media_cid.len() + // media_cid
                32 // slot_key
    )]
    pub ad: Account<'info, Ad>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub slot: Account<'info, AdSlot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyFixedPrice<'info> {
    #[account(mut)]
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub buyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub bidder: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseAuction<'info> {
    #[account(mut)]
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeactivateSlot<'info> {
    #[account(mut)]
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct IncrementView<'info> {
    #[account(mut)]
    pub ad_slot: Account<'info, AdSlot>,
}

#[event]
pub struct SlotCreated {
    pub slot_id: String,
    pub owner: Pubkey,
}

#[event]
pub struct AdCreated {
    pub ad_id: String,
    pub owner: Pubkey,
}

#[event]
pub struct SlotPurchased {
    pub slot_id: String,
    pub buyer: Pubkey,
}

#[event]
pub struct BidPlaced {
    pub slot_id: String,
    pub bidder: Pubkey,
    pub amount: u64,
}

#[event]
pub struct AuctionClosed {
    pub slot_id: String,
    pub winner: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid purchase type")]
    InvalidPurchaseType,
    #[msg("Ad slot not active")]
    SlotNotActive,
    #[msg("Bid too low")]
    BidTooLow,
    #[msg("Auction has ended")]
    AuctionEnded,
    #[msg("Auction has not ended")]
    AuctionNotEnded,
    #[msg("Unauthorized action")]
    Unauthorized,
}