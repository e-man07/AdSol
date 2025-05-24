"use client";

import { FC, useState, useEffect } from 'react';
import { useAdProgram, Ad } from '@/utils/solana-program';
import useWalletConnection from '@/hooks/useWalletConnection';
import { toast } from 'sonner';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdListProps {
  refreshTrigger: number;
}

export const AdList: FC<AdListProps> = ({ refreshTrigger }) => {
  const { connected } = useWalletConnection();
  const { getAdvertiserAds } = useAdProgram();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch ads on component mount and when refresh is triggered
  useEffect(() => {
    const fetchAds = async () => {
      if (!connected) {
        setAds([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const advertiserAds = await getAdvertiserAds();
        setAds(advertiserAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
        toast.error('Failed to load your ads');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAds();
    
    // Set up polling for updates every 10 seconds
    const intervalId = setInterval(fetchAds, 10000);
    
    return () => clearInterval(intervalId);
  }, [connected, getAdvertiserAds, refreshTrigger]);
  
  const openIPFSLink = (cid: string) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, '_blank');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading your ads...</span>
      </div>
    );
  }
  
  if (!connected) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Wallet Not Connected</h3>
        <p className="text-gray-400">Please connect your wallet to view your ads</p>
      </div>
    );
  }
  
  if (ads.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Ads Found</h3>
        <p className="text-gray-400">You haven't created any ads yet. Use the form above to create your first ad.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Your Ads</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div 
            key={ad.id}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white truncate">{ad.id}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ad.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {ad.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Slot ID:</span>
                  <span className="text-white">{ad.slotId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Media:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 p-0 h-auto flex items-center"
                    onClick={() => openIPFSLink(ad.mediaCid)}
                  >
                    View on IPFS
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">IPFS CID:</span>
                  <span className="text-white font-mono text-xs truncate max-w-[150px]" title={ad.mediaCid}>
                    {ad.mediaCid}
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-700">
                <Button
                  onClick={() => openIPFSLink(ad.mediaCid)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Media
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdList;
