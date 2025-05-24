"use client";

import { FC, useState } from 'react';
import useWalletConnection from '@/hooks/useWalletConnection';
import { AlertCircle } from 'lucide-react';
import AdCreationForm from './AdCreationForm';
import SlotFilterForm from './SlotFilterForm';
import SlotList from './SlotList';
import AdList from './AdList';

export const AdvertiserDashboard: FC = () => {
  const { connected } = useWalletConnection();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [category, setCategory] = useState('');
  const [minAudienceSize, setMinAudienceSize] = useState('');
  
  // Trigger refresh of lists
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  if (!connected) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Wallet Not Connected</h3>
          <p className="text-gray-400">Please connect your wallet to access the advertiser dashboard</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Advertiser Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Ad Creation Form */}
          <div>
            <AdCreationForm onSuccess={handleRefresh} />
          </div>
          
          {/* Slot Filter Form */}
          <div>
            <SlotFilterForm 
              category={category}
              setCategory={setCategory}
              minAudienceSize={minAudienceSize}
              setMinAudienceSize={setMinAudienceSize}
            />
          </div>
          
          {/* Slot List */}
          <div>
            <SlotList 
              refreshTrigger={refreshTrigger} 
              category={category}
              minAudienceSize={minAudienceSize}
            />
          </div>
          
          {/* Ad List */}
          <div>
            <AdList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
