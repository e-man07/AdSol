use anchor_lang::prelude::*;

// Define AdSlot locally to avoid import issues
#[account]
pub struct AdSlot {
    pub owner: Pubkey,
    pub slot_id: String,
    pub price: u64,
    pub duration: u64,
    pub is_auction: bool,
    pub auction_end: i64,
    pub highest_bid: u64,
    pub highest_bidder: Pubkey,
    pub is_active: bool,
    pub view_count: u64,
    pub category: String,
    pub audience_size: u64,
}

declare_id!("5D3Ngbtgv2W3hyU7hCdXcx1XUZuFUyH1ufLstw1V7eN6");

#[program]
pub mod payments {
    use super::*;

    // for advertiser
    // escrow holding the payment
    // advertiser will pay for the ad, that'll go to escrow
    // based on the performance/outcome of ads, the escrow will release the payment to publisher
    pub fn escrow_payment(ctx: Context<EscrowPayment>, amount: u64) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        escrow.amount = amount;
        escrow.advertiser = *ctx.accounts.advertiser.key;
        escrow.publisher = ctx.accounts.ad_slot.owner;
        escrow.is_released = false;

        // Transfer SOL from advertiser to escrow account using system program
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.advertiser.to_account_info(),
            to: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        
        anchor_lang::system_program::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            amount,
        )?;

        // Emit event after all operations
        let escrow_key = ctx.accounts.escrow.key();
        let advertiser_key = *ctx.accounts.advertiser.key;
        let publisher_key = ctx.accounts.ad_slot.owner;
        
        emit!(EscrowCreated {
            escrow_key,
            advertiser: advertiser_key,
            publisher: publisher_key,
            amount,
        });
        
        Ok(())
    }

    // escrow will release based on parameters
    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        // Get keys before mutable borrow
        let escrow_key = ctx.accounts.escrow.key();
        let publisher_key = ctx.accounts.publisher.key();
        
        let escrow = &mut ctx.accounts.escrow;
        
        require!(escrow.amount > 0, ErrorCode::InvalidEscrow);
        require!(!escrow.is_released, ErrorCode::EscrowAlreadyReleased);
        require!(!ctx.accounts.ad_slot.is_active, ErrorCode::SlotActive);
        
        let escrow_lamports = escrow.to_account_info().lamports();
        require!(escrow_lamports >= escrow.amount, ErrorCode::InsufficientFunds);

        let release_amount = escrow.amount;

        // Transfer lamports from escrow to publisher
        **escrow.to_account_info().try_borrow_mut_lamports()? -= release_amount;
        **ctx.accounts.publisher.to_account_info().try_borrow_mut_lamports()? += release_amount;

        escrow.is_released = true;
        escrow.amount = 0;

        emit!(EscrowReleased {
            escrow_key,
            publisher: publisher_key,
            amount: release_amount,
        });
        
        Ok(())
    }

    // refund to advertiser if something goes wrong
    pub fn refund_escrow(ctx: Context<RefundEscrow>) -> Result<()> {
        // Get keys before mutable borrow
        let escrow_key = ctx.accounts.escrow.key();
        let advertiser_key = ctx.accounts.advertiser.key();
        
        let escrow = &mut ctx.accounts.escrow;
        
        require!(escrow.amount > 0, ErrorCode::InvalidEscrow);
        require!(!escrow.is_released, ErrorCode::EscrowAlreadyReleased);
        
        let escrow_lamports = escrow.to_account_info().lamports();
        require!(escrow_lamports >= escrow.amount, ErrorCode::InsufficientFunds);

        let refund_amount = escrow.amount;

        // Refund to advertiser
        **escrow.to_account_info().try_borrow_mut_lamports()? -= refund_amount;
        **ctx.accounts.advertiser.to_account_info().try_borrow_mut_lamports()? += refund_amount;

        escrow.is_released = true;
        escrow.amount = 0;

        emit!(EscrowRefunded {
            escrow_key,
            advertiser: advertiser_key,
            amount: refund_amount,
        });
        
        Ok(())
    }
}

#[account]
pub struct Escrow {
    pub amount: u64,           // 8 bytes
    pub advertiser: Pubkey,    // 32 bytes  
    pub publisher: Pubkey,     // 32 bytes
    pub is_released: bool,     // 1 byte - track release status
}

#[derive(Accounts)]
pub struct EscrowPayment<'info> {
    #[account(
        init,
        payer = advertiser,
        space = 8 + 8 + 32 + 32 + 1, // discriminator + Escrow fields
        seeds = [b"escrow", advertiser.key().as_ref(), ad_slot.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub advertiser: Signer<'info>,
    pub ad_slot: Account<'info, AdSlot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        has_one = publisher,
        constraint = !escrow.is_released @ ErrorCode::EscrowAlreadyReleased
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: This account is verified through the has_one constraint on escrow
    #[account(mut)]
    pub publisher: AccountInfo<'info>,
    
    #[account(constraint = ad_slot.owner == escrow.publisher)]
    pub ad_slot: Account<'info, AdSlot>,
    
    // Authority can be publisher or advertiser
    #[account(
        constraint = authority.key() == publisher.key() || 
                    authority.key() == escrow.advertiser @ ErrorCode::Unauthorized
    )]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(
        mut,
        has_one = advertiser,
        constraint = !escrow.is_released @ ErrorCode::EscrowAlreadyReleased
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: This account is verified through the has_one constraint on escrow  
    #[account(mut)]
    pub advertiser: AccountInfo<'info>,
    
    #[account(constraint = ad_slot.owner == escrow.publisher)]
    pub ad_slot: Account<'info, AdSlot>,
    
    // Only advertiser can request refund
    #[account(constraint = authority.key() == escrow.advertiser @ ErrorCode::Unauthorized)]
    pub authority: Signer<'info>,
}

#[event]
pub struct EscrowCreated {
    pub escrow_key: Pubkey,
    pub advertiser: Pubkey,
    pub publisher: Pubkey,
    pub amount: u64,
}

#[event]
pub struct EscrowReleased {
    pub escrow_key: Pubkey,
    pub publisher: Pubkey,
    pub amount: u64,
}

#[event]
pub struct EscrowRefunded {
    pub escrow_key: Pubkey,
    pub advertiser: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid escrow state")]
    InvalidEscrow,
    #[msg("Ad slot still active")]
    SlotActive,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Escrow already released")]
    EscrowAlreadyReleased,
    #[msg("Insufficient funds in escrow")]
    InsufficientFunds,
    #[msg("Unauthorized action")]
    Unauthorized,
}