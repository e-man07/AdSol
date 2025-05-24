"use client";

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from '@/components/ui/wallet-button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import useWalletConnection from '@/hooks/useWalletConnection';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const { connected } = useWalletConnection();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrollY > 50 ? "bg-black/90 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <Sparkles className="h-6 w-6 text-purple-400" />
            </motion.div>
            {/* <Link href="/" className="text-xl md:text-2xl font-bold text-white truncate">
              {isLandingPage ? "SolAds" : "Ad Marketplace"}
            </Link> */}
          </div>
          
          <div className="flex items-center gap-6">
            {!isLandingPage && (
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/home"
                  className="text-white/80 hover:text-white transition-colors relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {connected && (
                  <Link 
                    href={pathname.includes('/dashboard') ? pathname : "/dashboard"}
                    className="text-white/80 hover:text-white transition-colors relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </div>
            )}
            <WalletButton 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white border-purple-500/30 shadow-md shadow-purple-500/10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
