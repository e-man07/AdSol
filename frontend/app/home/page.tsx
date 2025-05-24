"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import RoleSelection from '@/components/RoleSelection';
import AdvertiserDashboard from '@/components/advertiser/AdvertiserDashboard';
import useWalletConnection from '@/hooks/useWalletConnection';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { role, setRole } = useRole();
  const { connected } = useWalletConnection();
  const router = useRouter();
  
  // Redirect to dashboard based on role
  useEffect(() => {
    if (role === 'publisher') {
      router.push('/dashboard/publisher');
    } else if (role === 'advertiser') {
      router.push('/dashboard/advertiser');
    }
  }, [role, router]);
  
  // Handle switching back to role selection
  const handleSwitchRole = () => {
    setRole(null);
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-gray-700/20 to-gray-900/20 blur-xl"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-24">
        {role ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </motion.div>
                <h1 className="text-2xl font-bold">
                  {role === 'publisher' ? 'Publisher Dashboard' : 'Advertiser Dashboard'}
                </h1>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSwitchRole}
                className="border-purple-800 bg-purple-900/30 hover:bg-purple-800/50 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Switch Role
              </Button>
            </div>
            
            {role === 'publisher' ? (
              <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mr-3"></div>
                  <span>Redirecting to Publisher Dashboard...</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                <AdvertiserDashboard />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-4xl">
              <RoleSelection className="mt-8" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
