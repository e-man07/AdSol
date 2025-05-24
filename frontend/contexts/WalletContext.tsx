"use client";

import { FC, ReactNode, useMemo } from "react";
import { 
  ConnectionProvider, 
  WalletProvider 
} from "@solana/wallet-adapter-react";
import { 
  WalletAdapterNetwork 
} from "@solana/wallet-adapter-base";
import { 
  PhantomWalletAdapter 
} from "@solana/wallet-adapter-wallets";
import { 
  WalletModalProvider 
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Import the wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Set to 'devnet' as specified in the requirements
  const network = WalletAdapterNetwork.Devnet;
  
  // Generate the connection endpoint using Solana's clusterApiUrl
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Initialize wallet adapters - only Phantom wallet as per requirements
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
