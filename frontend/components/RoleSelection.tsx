"use client";

import { FC, useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import useWalletConnection from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { UserRound, PresentationIcon } from 'lucide-react';
import WalletModal from './ui/wallet-modal';

interface RoleSelectionProps {
  className?: string;
}

export const RoleSelection: FC<RoleSelectionProps> = ({ className }) => {
  const { setRole } = useRole();
  const { connected } = useWalletConnection();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const handleRoleSelection = (role: 'publisher' | 'advertiser') => {
    if (!connected) {
      // Open wallet modal if not connected
      setWalletModalOpen(true);
      return;
    }
    
    // Set role and navigate to dashboard
    setRole(role);
  };
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
          Choose Your Role
        </h2>
        <p className="text-gray-300 max-w-md mx-auto text-lg">
          Select whether you want to participate as a publisher or advertiser in the SolAds marketplace.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          className="rounded-xl overflow-hidden shadow-lg shadow-blue-500/10"
        >
          <Button
            onClick={() => handleRoleSelection('publisher')}
            className="w-full py-10 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl flex flex-col items-center justify-center gap-4 transition-all border border-blue-500/30"
          >
            <div className="p-3 bg-blue-500/20 rounded-full">
              <PresentationIcon className="h-12 w-12" />
            </div>
            <span className="text-2xl font-medium">Publisher</span>
            <span className="text-sm text-blue-100 font-normal max-w-[80%] text-center">Monetize your content with ads</span>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          className="rounded-xl overflow-hidden shadow-lg shadow-purple-500/10"
        >
          <Button
            onClick={() => handleRoleSelection('advertiser')}
            className="w-full py-10 bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-xl flex flex-col items-center justify-center gap-4 transition-all border border-purple-500/30"
          >
            <div className="p-3 bg-purple-500/20 rounded-full">
              <UserRound className="h-12 w-12" />
            </div>
            <span className="text-2xl font-medium">Advertiser</span>
            <span className="text-sm text-purple-100 font-normal max-w-[80%] text-center">Create and manage ad campaigns</span>
          </Button>
        </motion.div>
      </div>
      
      {!connected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg max-w-md"
        >
          <p className="text-yellow-300 text-center">
            You'll need to connect your wallet before selecting a role.
          </p>
        </motion.div>
      )}
      
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  );
};

export default RoleSelection;
