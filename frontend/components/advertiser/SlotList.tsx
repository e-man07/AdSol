"use client";

import { FC, useState, useEffect } from 'react';
import { useAdProgram, AdSlot } from '@/utils/solana-program';
import useWalletConnection from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AlertCircle, Clock } from 'lucide-react';

interface SlotListProps {
  refreshTrigger: number;
  category: string;
  minAudienceSize: string;
}

export const SlotList: FC<SlotListProps> = ({ refreshTrigger, category, minAudienceSize }) => {
  const { connected } = useWalletConnection();
  const { getAllSlots, buyFixedPriceSlot, placeBid } = useAdProgram();
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingSlot, setProcessingSlot] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<Record<string, string>>({});
  
  // Fetch slots on component mount and when refresh is triggered
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const allSlots = await getAllSlots();
        setSlots(allSlots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        toast.error('Failed to load ad slots');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlots();
    
    // Set up polling for updates every 10 seconds
    const intervalId = setInterval(fetchSlots, 10000);
    
    return () => clearInterval(intervalId);
  }, [getAllSlots, refreshTrigger]);
  
  // Filter slots based on category and minimum audience size
  useEffect(() => {
    let filtered = [...slots];
    
    if (category) {
      filtered = filtered.filter(slot => 
        slot.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (minAudienceSize && !isNaN(Number(minAudienceSize))) {
      const minSize = Number(minAudienceSize);
      filtered = filtered.filter(slot => 
        slot.audienceSize.toNumber() >= minSize
      );
    }
    
    // Only show active slots
    filtered = filtered.filter(slot => slot.active);
    
    setFilteredSlots(filtered);
  }, [slots, category, minAudienceSize]);
  
  // Handle buying a fixed-price slot
  const handleBuyFixedPrice = async (slot: AdSlot) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setProcessingSlot(slot.id);
      const price = slot.price.toNumber();
      
      toast.info(`Processing purchase for ${slot.id}...`);
      const result = await buyFixedPriceSlot(slot.id, price);
      
      if (result.success) {
        toast.success(`Successfully purchased slot ${slot.id}!`);
      }
    } catch (error: any) {
      toast.error(`Failed to purchase slot: ${error.message}`);
      console.error('Error purchasing slot:', error);
    } finally {
      setProcessingSlot(null);
    }
  };
  
  // Handle placing a bid on an auction slot
  const handlePlaceBid = async (slot: AdSlot) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    const bidAmountStr = bidAmount[slot.id];
    if (!bidAmountStr || isNaN(Number(bidAmountStr))) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    
    const bidAmountSol = Number(bidAmountStr);
    const bidAmountLamports = bidAmountSol * LAMPORTS_PER_SOL;
    
    // Check if bid is higher than current highest bid
    const currentBid = slot.currentBid ? slot.currentBid.toNumber() : 0;
    if (bidAmountLamports <= currentBid) {
      toast.error(`Bid must be higher than current bid (${currentBid / LAMPORTS_PER_SOL} SOL)`);
      return;
    }
    
    try {
      setProcessingSlot(slot.id);
      
      toast.info(`Processing bid for ${slot.id}...`);
      const result = await placeBid(slot.id, bidAmountLamports);
      
      if (result.success) {
        toast.success(`Successfully placed bid on slot ${slot.id}!`);
        setBidAmount(prev => ({ ...prev, [slot.id]: '' }));
        
        // Update the slot with the new bid information
        setSlots(prevSlots => 
          prevSlots.map(s => 
            s.id === slot.id 
              ? { 
                  ...s, 
                  currentBid: { toNumber: () => bidAmountLamports } as any
                } 
              : s
          )
        );
      }
    } catch (error: any) {
      toast.error(`Failed to place bid: ${error.message}`);
      console.error('Error placing bid:', error);
    } finally {
      setProcessingSlot(null);
    }
  };
  
  // Format duration from seconds to a readable string
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };
  
  // Format auction end date
  const formatAuctionEnd = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading ad slots...</span>
      </div>
    );
  }
  
  if (filteredSlots.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Ad Slots Found</h3>
        <p className="text-gray-400">
          {slots.length === 0 
            ? 'There are currently no available ad slots.' 
            : 'No slots match your filter criteria. Try adjusting your filters.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Available Ad Slots</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map((slot) => (
          <div 
            key={slot.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white truncate">{slot.id}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.purchaseType === 'fixed' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'
                }`}>
                  {slot.purchaseType === 'fixed' ? 'Fixed Price' : 'Auction'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">{(slot.price.toNumber() / LAMPORTS_PER_SOL).toFixed(2)} SOL</span>
                </div>
                
                {slot.purchaseType === 'auction' && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Bid:</span>
                    <span className="text-white font-medium">
                      {slot.currentBid 
                        ? `${(slot.currentBid.toNumber() / LAMPORTS_PER_SOL).toFixed(2)} SOL` 
                        : 'No bids yet'}
                    </span>
                  </div>
                )}
                
                {slot.purchaseType === 'auction' && slot.auctionEnd && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Ends:
                    </span>
                    <span className="text-white">{formatAuctionEnd(slot.auctionEnd.toNumber())}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{formatDuration(slot.duration.toNumber())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{slot.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Audience Size:</span>
                  <span className="text-white">{slot.audienceSize.toNumber().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Views:</span>
                  <span className="text-white">{slot.viewCount.toNumber().toLocaleString()}</span>
                </div>
              </div>
              
              {slot.purchaseType === 'fixed' ? (
                <Button
                  onClick={() => handleBuyFixedPrice(slot)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!connected || processingSlot === slot.id}
                >
                  {processingSlot === slot.id ? 'Processing...' : 'Buy Now'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Bid amount in SOL"
                      value={bidAmount[slot.id] || ''}
                      onChange={(e) => setBidAmount({...bidAmount, [slot.id]: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      disabled={!connected || processingSlot === slot.id}
                      step="0.01"
                      min={(slot.currentBid ? slot.currentBid.toNumber() / LAMPORTS_PER_SOL : 0) + 0.01}
                    />
                    <Button
                      onClick={() => handlePlaceBid(slot)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={!connected || processingSlot === slot.id}
                    >
                      {processingSlot === slot.id ? 'Bidding...' : 'Place Bid'}
                    </Button>
                  </div>
                  {slot.currentBid && (
                    <p className="text-xs text-gray-400">
                      Minimum bid: {((slot.currentBid.toNumber() / LAMPORTS_PER_SOL) + 0.01).toFixed(2)} SOL
                    </p>
                  )}
                </div>
              )}
              
              {!connected && (
                <p className="mt-2 text-center text-yellow-500 text-xs">
                  Connect wallet to interact
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotList;
