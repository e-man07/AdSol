"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useCallback } from 'react';

export const useWalletConnection = () => {
  const { 
    publicKey, 
    wallet, 
    disconnect, 
    connected, 
    connecting, 
    disconnecting,
    select,
    wallets
  } = useWallet();

  const walletAddress = publicKey?.toBase58() || '';
  
  const shortenedAddress = walletAddress 
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : '';

  const connectWallet = useCallback((walletName: string) => {
    const selectedWallet = wallets.find(w => w.adapter.name === walletName);
    if (selectedWallet) {
      select(selectedWallet.adapter.name as WalletName);
    }
  }, [wallets, select]);

  const connectPhantom = useCallback(() => {
    connectWallet('Phantom');
  }, [connectWallet]);

  return {
    publicKey,
    walletAddress,
    shortenedAddress,
    connected,
    connecting,
    disconnecting,
    disconnect,
    connectPhantom,
    wallet: wallet?.adapter.name || '',
  };
};

export default useWalletConnection;
