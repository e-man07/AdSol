"use client";

import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import useWalletConnection from "@/hooks/useWalletConnection";
import { PresentationIcon, UserRound } from "lucide-react";
import { FC, useState } from "react";
import WalletModal from "./ui/wallet-modal";

interface RoleSelectionProps {
  className?: string;
  selectedRole?: string | null;
  isLoading?: boolean;
}

export const RoleSelection: FC<RoleSelectionProps> = ({ 
  className, 
  selectedRole = null, 
  isLoading = false 
}) => {
  const { setRole } = useRole();
  const { connected } = useWalletConnection();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const handleRoleSelection = (role: "publisher" | "advertiser") => {
    if (!connected) {
      setWalletModalOpen(true);
      return;
    }
    setRole(role);
  };

  return (
    <div className={`flex flex-col items-center justify-start w-full px-4 py-12 ${className || ''}`}>
      <div className="text-center mb-10 w-full max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          <span className="block">Choose Your</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
            Role in SolAds
          </span>
        </h2>
        <p className="text-purple-100/80 max-w-xl mx-auto px-2">
          Select your role to get started with SolAds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl px-2">
        <div className={`group relative rounded-xl border ${selectedRole === "publisher" && isLoading ? 'border-purple-500' : 'border-gray-800'} bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/50 transition-colors duration-300`}>
          <Button
            onClick={() => handleRoleSelection("publisher")}
            variant="ghost"
            disabled={isLoading}
            className="w-full h-full p-6 flex flex-col items-center justify-center gap-4 hover:bg-transparent"
          >
            {selectedRole === "publisher" && isLoading ? (
              <>
                <div className="relative p-3">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                  </div>
                  <PresentationIcon className="h-10 w-10 text-purple-400 opacity-30" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-white">Publisher</h3>
                  <p className="text-sm text-purple-100/80">
                    Taking you to the dashboard...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <PresentationIcon className="h-10 w-10 text-purple-400" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-white">Publisher</h3>
                  <p className="text-sm text-purple-100/80">
                    Monetize your content with ads
                  </p>
                </div>
              </>
            )}
          </Button>
        </div>

        <div className={`group relative rounded-xl border ${selectedRole === "advertiser" && isLoading ? 'border-purple-500' : 'border-gray-800'} bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/50 transition-colors duration-300`}>
          <Button
            onClick={() => handleRoleSelection("advertiser")}
            variant="ghost"
            disabled={isLoading}
            className="w-full h-full p-6 flex flex-col items-center justify-center gap-4 hover:bg-transparent"
          >
            {selectedRole === "advertiser" && isLoading ? (
              <>
                <div className="relative p-3">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                  </div>
                  <UserRound className="h-10 w-10 text-purple-400 opacity-30" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-white">Advertiser</h3>
                  <p className="text-sm text-purple-100/80">
                    Taking you to the dashboard...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <UserRound className="h-10 w-10 text-purple-400" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-white">Advertiser</h3>
                  <p className="text-sm text-purple-100/80">
                    Create and manage ad campaigns
                  </p>
                </div>
              </>
            )}
          </Button>
        </div>
      </div>

      {!connected && (
        <div className="mt-8 p-4 bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl max-w-md">
          <p className="text-yellow-300 text-center text-sm">
            Connect your wallet to select a role and get started
          </p>
        </div>
      )}

      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};

export default RoleSelection;
