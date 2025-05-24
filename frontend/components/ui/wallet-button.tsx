"use client";

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import WalletModal from './wallet-modal';
import useWalletConnection from '@/hooks/useWalletConnection';

interface WalletButtonProps {
  className?: string;
}

export const WalletButton: FC<WalletButtonProps> = ({ className }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { connected, shortenedAddress, disconnect } = useWalletConnection();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={cn(
          "bg-white text-black hover:bg-gray-200 border-none rounded-lg font-medium transition-all",
          "px-4 py-2 h-10 flex items-center justify-center gap-2",
          "shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20",
          className
        )}
      >
        {connected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {shortenedAddress}
          </>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      <WalletModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};

export default WalletButton;
