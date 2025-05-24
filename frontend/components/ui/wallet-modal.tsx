"use client";

import React, { FC, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export const WalletModal: FC<WalletModalProps> = ({ open, onClose }) => {
  const { wallets, select } = useWallet();

  const handleWalletClick = useCallback((walletName: string) => {
    select(walletName as WalletName);
    onClose();
  }, [select, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your Solana wallet to access SolAds marketplace features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-between p-4 h-auto"
              onClick={() => handleWalletClick(wallet.adapter.name)}
            >
              <span>{wallet.adapter.name}</span>
              {wallet.adapter.icon && (
                <img 
                  src={wallet.adapter.icon} 
                  alt={`${wallet.adapter.name} icon`} 
                  className="h-6 w-6" 
                />
              )}
            </Button>
          ))}
        </div>
        <div className="pt-2 text-center text-xs text-gray-500">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
