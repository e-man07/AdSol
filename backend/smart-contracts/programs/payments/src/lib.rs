use anchor_lang::prelude::*;

declare_id!("7SGnj1aJyyjknA6zZeM4tb5y2j8LQrVBiKZmDCJECkdq");

#[program]
pub mod payment {
    use super::*;

    pub fn escrow_payment(ctx: Context<EscrowPayment>, amount: u64) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.amount = amount;
        escrow.advertiser = *ctx.accounts.advertiser.key;
        escrow.publisher = ctx.accounts.ad_slot.owner;
        escrow.slot_key = ctx.accounts.ad_slot.key();

        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.advertiser.to_account_info(),
            to: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        anchor_lang::system_program::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            amount,
        )?;
        Ok(())
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let publisher = &mut ctx.accounts.publisher;

        require!(escrow.amount > 0, ErrorCode::InvalidEscrow);
        require!(!ctx.accounts.ad_slot.is_active, ErrorCode::SlotActive);

        **escrow.to_account_info().try_borrow_mut_lamports()? -= escrow.amount;
        **publisher.to_account_info().try_borrow_mut_lamports()? += escrow.amount;

        escrow.amount = 0;
        Ok(())
    }
}

#[account]
pub struct Escrow {
    pub amount: u64,
    pub advertiser: Pubkey,
    pub publisher: Pubkey,
    pub slot_key: Pubkey,
}

#[derive(Accounts)]
pub struct EscrowPayment<'info> {
    #[account(
        init,
        payer = advertiser,
        space = 8 + 8 + 32 + 32 + 32
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub advertiser: Signer<'info>,
    pub ad_slot: Account<'info, AdSlot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(mut, has_one = publisher, has_one = slot_key)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub publisher: AccountInfo<'info>,
    pub ad_slot: Account<'info, AdSlot>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid escrow state")]
    InvalidEscrow,
    #[msg("Ad slot still active")]
    SlotActive,
}