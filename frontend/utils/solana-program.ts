"use client";

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, web3 } from '@project-serum/anchor';
import adMarketplaceIDL from './ad_marketplace.json';
import paymentsIDL from './payments.json';

// Actual program IDs from the deployed smart contracts
const AD_MARKETPLACE_PROGRAM_ID = new PublicKey('5JFj9EFPa45pycaUmR8GwdzNXjZqZQ5ZQ3n6ndhQPYse');
const PAYMENTS_PROGRAM_ID = new PublicKey('7by1kwKb8JK1rLATnwtRFKvWjUqqV4HMQyFWa9UwVg8k');

// Type definitions for account data
interface AdSlotAccount {
  owner: PublicKey;
  slot_id: string;
  price: BN;
  duration: BN;
  is_auction: boolean;
  auction_end: BN;
  highest_bid: BN;
  highest_bidder: PublicKey;
  is_active: boolean;
  view_count: BN;
  category: string;
  audience_size: BN;
}

interface AdAccount {
  owner: PublicKey;
  ad_id: string;
  media_cid: string;
  slot_key: PublicKey;
}

interface EscrowAccount {
  amount: BN;
  advertiser: PublicKey;
  publisher: PublicKey;
  is_released: boolean;
}

// Real program implementation using Anchor
export const useAdProgram = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  
  // Get the ad marketplace program instance
  const getAdMarketplaceProgram = () => {
    if (!wallet || !connection) {
      console.log('Wallet or connection not available');
      return null;
    }
    
    if (!wallet.publicKey) {
      console.log('Wallet public key not available');
      return null;
    }
    
    const provider = new AnchorProvider(
      connection, 
      wallet as any, 
      { commitment: 'processed' }
    );
    
    try {      
      return new Program(adMarketplaceIDL as any, AD_MARKETPLACE_PROGRAM_ID, provider);
    } catch (error) {
      console.error("Error initializing ad marketplace program:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      return null;
    }
  };
  
  // Get the payments program instance
  const getPaymentsProgram = () => {
    if (!wallet || !connection) {
      console.log('Wallet or connection not available');
      return null;
    }
    
    if (!wallet.publicKey) {
      console.log('Wallet public key not available');
      return null;
    }
    
    const provider = new AnchorProvider(
      connection, 
      wallet as any, 
      { commitment: 'processed' }
    );
    
    try {      
      return new Program(paymentsIDL as any, PAYMENTS_PROGRAM_ID, provider);
    } catch (error) {
      console.error("Error initializing payments program:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      return null;
    }
  };
  
  // Create a new ad slot
  const createAdSlot = async (
    slotId: string,
    price: number,
    duration: number,
    purchaseType: 'fixed' | 'auction',
    auctionEnd: number | null,
    category: string,
    audienceSize: number
  ) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Limit string sizes to prevent memory issues
      const limitedSlotId = slotId.substring(0, 32); // Limit to 32 chars
      const limitedCategory = category.substring(0, 16); // Limit to 16 chars
      
      // Generate keypair for the new ad slot
      const adSlot = Keypair.generate();
      const isAuction = purchaseType === 'auction';
      const auctionEndTimestamp = isAuction && auctionEnd ? auctionEnd : 0;
      
      console.log('Creating ad slot with parameters:', {
        slotId: limitedSlotId,
        price,
        duration,
        isAuction,
        auctionEndTimestamp,
        category: limitedCategory,
        audienceSize
      });
      
      // Set compute budget to handle larger transactions
      const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 300000,
      });

      const modfiyMicroLamports = web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100,
      })
      
      // Create the transaction
      const tx = await program.methods.createAdSlot(
        limitedSlotId,
        new BN(price),
        new BN(duration),
        isAuction,
        new BN(auctionEndTimestamp),
        limitedCategory,
        new BN(audienceSize)
      )
      .accounts({
        adSlot: adSlot.publicKey,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions([modifyComputeUnits, modfiyMicroLamports]) // Add compute budget instruction
      .signers([adSlot])
      .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error creating ad slot:', error);
      throw error;
    }
  };
  
  const deactivateSlot = async (slotPubkey: PublicKey) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      const tx = await program.methods.deactivateSlot()
        .accounts({
          adSlot: slotPubkey,
          owner: wallet.publicKey,
        })
        .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error deactivating slot:', error);
      throw error;
    }
  };
  
  const getPublisherSlots = async () => {
    try {
      if (!wallet.publicKey) {
        return [];
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) return [];
      
      // Fetch all ad slot accounts owned by this publisher
      const slotAccounts = await program.account.adSlot.all([
        {
          memcmp: {
            offset: 8, // After the account discriminator
            bytes: wallet.publicKey.toBase58() // Filter by owner
          }
        }
      ]);
      
      // Transform the accounts to our AdSlot interface
      return slotAccounts.map(account => {
        // Cast to any to avoid TypeScript errors with dynamic properties
        const data = account.account as any;
        return {
          publicKey: account.publicKey,
          owner: data.owner,
          slot_id: data.slot_id,
          price: data.price,
          duration: data.duration,
          is_auction: data.is_auction,
          auction_end: data.auction_end,
          highest_bid: data.highest_bid,
          highest_bidder: data.highest_bidder,
          is_active: data.is_active,
          view_count: data.view_count,
          category: data.category,
          audience_size: data.audience_size
        };
      });
    } catch (error) {
      console.error('Error fetching publisher slots:', error);
      return [];
    }
  };

  // Get all available ad slots for advertisers
  const getAllSlots = async () => {
    try {
      const program = getAdMarketplaceProgram();
      if (!program) return [];
      
      // Fetch all active ad slot accounts
      const slotAccounts = await program.account.adSlot.all();
      
      // Filter for active slots
      const activeSlots = slotAccounts.filter(account => {
        const data = account.account as any;
        return data && data.isActive === true;
      });
      
      // Transform the accounts to our AdSlot interface
      return activeSlots.map(account => {
        // Cast to any to avoid TypeScript errors with dynamic properties
        const data = account.account as any;
        return {
          publicKey: account.publicKey,
          owner: data.owner,
          slot_id: data.slotId,
          price: data.price,
          duration: data.duration,
          is_auction: data.isAuction,
          auction_end: data.auctionEnd,
          highest_bid: data.highestBid,
          highest_bidder: data.highestBidder,
          is_active: data.isActive,
          view_count: data.viewCount,
          category: data.category,
          audience_size: data.audienceSize
        };
      });
    } catch (error) {
      console.error('Error fetching all slots:', error);
      return [];
    }
  };

  // Create a new ad
  const createAd = async (adId: string, slotId: string, mediaCid: string) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      const ad = Keypair.generate();
      
      const tx = await program.methods.createAd(
        adId,
        slotId,
        mediaCid
      )
      .accounts({
        ad: ad.publicKey,
        advertiser: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([ad])
      .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  };

  // Buy a fixed-price slot
  const buyFixedPriceSlot = async (slotId: string, price: number) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Find the slot account by ID
      const slotAccounts = await program.account.adSlot.all();
      
      // Filter by slot ID
      const filteredSlots = slotAccounts.filter(account => {
        const data = account.account as any;
        return data.slotId === slotId;
      });
      
      if (filteredSlots.length === 0) {
        throw new Error(`Slot with ID ${slotId} not found`);
      }
      
      const slotAccount = filteredSlots[0];
      
      const tx = await program.methods.buyFixedPriceSlot()
        .accounts({
          adSlot: slotAccount.publicKey,
          buyer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error buying fixed-price slot:', error);
      throw error;
    }
  };

  // Place a bid on an auction slot
  const placeBid = async (slotId: string, bidAmount: number) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Find the slot account by ID
      const slotAccounts = await program.account.adSlot.all();
      
      // Filter by slot ID
      const filteredSlots = slotAccounts.filter(account => {
        const data = account.account as any;
        return data.slotId === slotId;
      });
      
      if (filteredSlots.length === 0) {
        throw new Error(`Slot with ID ${slotId} not found`);
      }
      
      const slotAccount = filteredSlots[0];
      
      const tx = await program.methods.placeBid(
        new BN(bidAmount * LAMPORTS_PER_SOL)
      )
        .accounts({
          adSlot: slotAccount.publicKey,
          bidder: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  };

  // Get advertiser's ads
  const getAdvertiserAds = async () => {
    try {
      if (!wallet.publicKey) {
        return [];
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) return [];
      
      // Fetch all ad accounts for this advertiser
      const adAccounts = await program.account.ad.all();
      
      // Filter by advertiser
      const filteredAds = adAccounts.filter(account => {
        const data = account.account as any;
        return data && wallet.publicKey && data.advertiser && 
               data.advertiser.toString() === wallet.publicKey.toString();
      });
      
      // Transform the accounts to our Ad interface
      return filteredAds.map(account => {
        const data = account.account as any;
        return {
          id: data.adId,
          advertiser: data.advertiser,
          slotId: data.slotId,
          mediaCid: data.mediaCid,
          active: data.isActive
        };
      });
    } catch (error) {
      console.error('Error fetching advertiser ads:', error);
      return [];
    }
  };
  
  // Close an auction that has ended
  const closeAuction = async (slotPubkey: PublicKey) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      const tx = await program.methods.closeAuction()
        .accounts({
          adSlot: slotPubkey,
        })
        .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error closing auction:', error);
      throw error;
    }
  };
  
  // Increment view count for an ad slot
  const incrementView = async (slotPubkey: PublicKey) => {
    try {
      const program = getAdMarketplaceProgram();
      if (!program) throw new Error('Program not initialized');
      
      const tx = await program.methods.incrementView()
        .accounts({
          adSlot: slotPubkey,
        })
        .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error incrementing view:', error);
      throw error;
    }
  };
  
  // Create an escrow payment for an ad slot
  const createEscrowPayment = async (adSlotPublicKey: PublicKey, amount: number) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getPaymentsProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Calculate the escrow PDA
      const [escrowPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('escrow'),
          wallet.publicKey.toBuffer(),
          adSlotPublicKey.toBuffer()
        ],
        PAYMENTS_PROGRAM_ID
      );
      
      const tx = await program.methods.escrowPayment(
        new BN(amount * LAMPORTS_PER_SOL)
      )
      .accounts({
        escrow: escrowPDA,
        advertiser: wallet.publicKey,
        adSlot: adSlotPublicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error creating escrow payment:', error);
      throw error;
    }
  };
  
  // Release escrow payment to publisher
  const releaseEscrowPayment = async (adSlotPublicKey: PublicKey, publisherPublicKey: PublicKey) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getPaymentsProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Calculate the escrow PDA
      const [escrowPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('escrow'),
          wallet.publicKey.toBuffer(),
          adSlotPublicKey.toBuffer()
        ],
        PAYMENTS_PROGRAM_ID
      );
      
      const tx = await program.methods.releaseEscrow()
      .accounts({
        escrow: escrowPDA,
        publisher: publisherPublicKey,
        adSlot: adSlotPublicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error releasing escrow payment:', error);
      throw error;
    }
  };
  
  // Refund escrow payment to advertiser
  const refundEscrowPayment = async (adSlotPublicKey: PublicKey) => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      const program = getPaymentsProgram();
      if (!program) throw new Error('Program not initialized');
      
      // Calculate the escrow PDA
      const [escrowPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('escrow'),
          wallet.publicKey.toBuffer(),
          adSlotPublicKey.toBuffer()
        ],
        PAYMENTS_PROGRAM_ID
      );
      
      const tx = await program.methods.refundEscrow()
      .accounts({
        escrow: escrowPDA,
        advertiser: wallet.publicKey,
        adSlot: adSlotPublicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
      return {
        success: true,
        signature: tx
      };
    } catch (error) {
      console.error('Error refunding escrow payment:', error);
      throw error;
    }
  };
  
  return {
    createAdSlot,
    deactivateSlot,
    closeAuction,
    incrementView,
    getPublisherSlots,
    getAllSlots,
    createAd,
    buyFixedPriceSlot,
    placeBid,
    getAdvertiserAds,
    createEscrowPayment,
    releaseEscrowPayment,
    refundEscrowPayment
  };
};
