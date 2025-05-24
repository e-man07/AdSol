"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Sparkles,
  BarChart3,
  PieChart,
  Wallet,
  Newspaper,
  ImageIcon,
  DollarSign,
  Megaphone,
  Target,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const isPublisher = pathname.includes('/dashboard/publisher')
  const isAdvertiser = pathname.includes('/dashboard/advertiser')
  
  const publisherLinks = [
    { name: "Dashboard", href: "/dashboard/publisher", icon: LayoutDashboard },
    { name: "Ad Slots", href: "/dashboard/publisher/ad-slots", icon: Newspaper },
    { name: "Analytics", href: "/dashboard/publisher/analytics", icon: BarChart3 },
    { name: "Earnings", href: "/dashboard/publisher/earnings", icon: DollarSign },
    { name: "Settings", href: "/dashboard/publisher/settings", icon: Settings },
  ]
  
  const advertiserLinks = [
    { name: "Dashboard", href: "/dashboard/advertiser", icon: LayoutDashboard },
    { name: "Campaigns", href: "/dashboard/advertiser/campaigns", icon: Megaphone },
    { name: "Ad Library", href: "/dashboard/advertiser/ad-library", icon: ImageIcon },
    { name: "Analytics", href: "/dashboard/advertiser/analytics", icon: PieChart },
    { name: "Budget", href: "/dashboard/advertiser/budget", icon: Wallet },
    { name: "Settings", href: "/dashboard/advertiser/settings", icon: Settings },
  ]
  
  const links = isPublisher ? publisherLinks : advertiserLinks

  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-gray-700/10 to-gray-900/10 blur-xl"
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
      
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 relative z-10">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <Sparkles className="h-6 w-6 text-purple-400" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">SolAds</span>
          </Link>
        </div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md shadow-purple-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{isPublisher ? "Publisher" : "Advertiser"} Dashboard</p>
              <p className="text-sm text-gray-400">Connected Wallet</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/home"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Home className="h-5 w-5 text-gray-400" />
            <span>Home</span>
          </Link>
          
          <div className="py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          </div>
          
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <motion.div key={link.name} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-500/20" 
                      : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Button variant="outline" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </aside>
      
      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-gray-900/80 backdrop-blur-md border-gray-800">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gray-900/90 backdrop-blur-md border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <Sparkles className="h-6 w-6 text-purple-400" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">SolAds</span>
            </Link>
          </div>
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md shadow-purple-500/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{isPublisher ? "Publisher" : "Advertiser"} Dashboard</p>
                <p className="text-sm text-gray-400">Connected Wallet</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/home"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5 text-gray-400" />
              <span>Home</span>
            </Link>
            
            <div className="py-2">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            </div>
            
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-500/20" 
                      : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Button variant="outline" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
