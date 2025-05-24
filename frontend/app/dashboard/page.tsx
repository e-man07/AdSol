"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import RoleSelection from '@/components/RoleSelection';
import useWalletConnection from '@/hooks/useWalletConnection';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { role, isRoleSelected } = useRole();
  const { connected } = useWalletConnection();
  const router = useRouter();
  
  // Redirect to the appropriate dashboard if role is already selected
  useEffect(() => {
    if (connected && isRoleSelected && role) {
      router.push(`/dashboard/${role}`);
    }
  }, [connected, isRoleSelected, role, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          {/* Role Selection Component */}
          <RoleSelection />
          
          {/* Additional information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-medium text-gray-300 mb-4">Why choose SolAds?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-purple-400 text-2xl font-bold mb-2">100%</div>
                <div className="text-gray-300">On-chain transparency</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-purple-400 text-2xl font-bold mb-2">0%</div>
                <div className="text-gray-300">Middleman fees</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-purple-400 text-2xl font-bold mb-2">Instant</div>
                <div className="text-gray-300">Settlement payments</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
