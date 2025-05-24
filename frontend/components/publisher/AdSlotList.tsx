"use client";

import { FC, useState, useEffect } from 'react';
import { useAdProgram, AdSlot } from '@/utils/solana-program';
import useWalletConnection from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface AdSlotListProps {
  refreshTrigger: number;
}

export const AdSlotList: FC<AdSlotListProps> = ({ refreshTrigger }) => {
  const { connected } = useWalletConnection();
  const { getPublisherSlots, deactivateSlot } = useAdProgram();
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deactivatingSlot, setDeactivatingSlot] = useState<string | null>(null);
  
  // Fetch slots on component mount and when refresh is triggered
  useEffect(() => {
    const fetchSlots = async () => {
      if (!connected) {
        setSlots([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const publisherSlots = await getPublisherSlots();
        setSlots(publisherSlots);
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
  }, [connected, getPublisherSlots, refreshTrigger]);
  
  // Handle slot deactivation
  const handleDeactivate = async (slotId: string) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setDeactivatingSlot(slotId);
      const result = await deactivateSlot(slotId);
      
      if (result.success) {
        toast.success('Ad slot deactivated successfully');
        // Update the local state to reflect the change
        setSlots(prevSlots => 
          prevSlots.map(slot => 
            slot.id === slotId ? { ...slot, active: false } : slot
          )
        );
      }
    } catch (error: any) {
      toast.error(`Failed to deactivate slot: ${error.message}`);
      console.error('Error deactivating slot:', error);
    } finally {
      setDeactivatingSlot(null);
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
  
  if (!connected) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Wallet Not Connected</h3>
        <p className="text-gray-400">Please connect your wallet to view your ad slots</p>
      </div>
    );
  }
  
  if (slots.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Ad Slots Found</h3>
        <p className="text-gray-400">You haven't created any ad slots yet. Use the form above to create your first slot.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Your Ad Slots</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div 
            key={slot.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white truncate">{slot.id}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {slot.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">{(slot.price.toNumber() / LAMPORTS_PER_SOL).toFixed(2)} SOL</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{slot.purchaseType === 'fixed' ? 'Fixed Price' : 'Auction'}</span>
                </div>
                
                {slot.purchaseType === 'auction' && slot.auctionEnd && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auction End:</span>
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
              
              {slot.active && (
                <Button
                  onClick={() => handleDeactivate(slot.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={deactivatingSlot === slot.id}
                >
                  {deactivatingSlot === slot.id ? 'Deactivating...' : 'Deactivate Slot'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdSlotList;
