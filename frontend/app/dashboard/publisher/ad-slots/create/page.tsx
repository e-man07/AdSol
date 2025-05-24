"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdSlotForm from '@/components/publisher/AdSlotForm';
import useWalletConnection from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateAdSlotPage() {
  const { connected } = useWalletConnection();
  const router = useRouter();
  
  const handleSuccess = () => {
    // Redirect to the ad slots page after successful creation
    router.push('/dashboard/publisher/ad-slots');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/publisher/ad-slots">
          <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Ad Slot</h1>
          <p className="text-gray-400">Create a new ad slot for advertisers to purchase</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdSlotForm onSuccess={handleSuccess} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Ad Slot Guidelines</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Set competitive prices based on your audience size and engagement</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Choose between fixed price or auction models</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Provide accurate audience size data for better targeting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Use descriptive slot IDs to help advertisers identify placement</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>All transactions are on-chain and require wallet signature</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Pricing Tips</h3>
            <p className="text-gray-300 mb-4">
              Average prices by category:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Technology</span>
                <span className="font-medium">0.3-0.5 SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Finance</span>
                <span className="font-medium">0.4-0.7 SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gaming</span>
                <span className="font-medium">0.2-0.4 SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mobile</span>
                <span className="font-medium">0.3-0.6 SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
