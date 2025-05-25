"use client";

import WalletButton from "@/components/ui/wallet-button";
import useWalletConnection from "@/hooks/useWalletConnection";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { connected } = useWalletConnection();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = isLandingPage
    ? ["Features", "How It Works", "Pricing", "Marketplace"]
    : [...(connected ? ["Dashboard"] : [])];

  const getNavHref = (item: string) => {
    if (isLandingPage) {
      return `#${item.toLowerCase().replace(/\s+/g, "-")}`;
    }

    if (item === "Dashboard")
      return pathname.includes("/dashboard") ? pathname : "/dashboard";
    return "#";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrollY > 50
          ? "bg-black/90 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5",
        className
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <Link href="/" className="text-2xl font-bold text-white">
            AdSol
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {!isLandingPage ||
            navItems.map((item) => (
              <Link
                key={item}
                href={getNavHref(item)}
                className="relative font-medium group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <WalletButton />
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={getNavHref(item)}
                className="py-2 px-4 hover:bg-purple-800/50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="mt-2">
              <WalletButton className="w-full justify-center" />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
