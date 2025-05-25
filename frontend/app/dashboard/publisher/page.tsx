"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import RoleSwitcher from "@/components/RoleSwitcher"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdSlotForm from "@/components/publisher/AdSlotForm"
import { useAdProgram } from "@/utils/solana-program"
import { useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  MoreVertical,
  MousePointerClick,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

// Define interfaces for our data structures
interface StatItem {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "none"
  icon: React.ElementType
}

interface AdSlot {
  id: string
  name: string
  price: string
  duration?: string
  status: "Active" | "Auction" | "Pending" | string
  impressions?: number
  clicks?: number
  created: string
}

interface PerformerSlot {
  name: string
  revenue: number
  ctr: number
}

interface Payment {
  id: string
  amount: string
  from: string
  date: string
  status: string
}

interface SlotData {
  publicKey: PublicKey
  owner: PublicKey
  slot_id: string
  price: { toNumber: () => number }
  duration: { toNumber: () => number }
  is_auction: boolean
  auction_end: { toNumber: () => number }
  highest_bid: { toNumber: () => number }
  highest_bidder?: PublicKey
  is_active: boolean
  view_count: { toNumber: () => number }
  category: string
  audience_size: { toNumber: () => number }
}

interface AdSlotUI {
  id: string
  publicKey: PublicKey
  name: string
  price: string
  priceRaw: number
  duration: string
  durationDays: number
  status: string
  type: string
  impressions: number
  category: string
  description: string
  auctionEnd: number
  highestBid: number
  highestBidder: string
  audienceSize: number
  ownerAddress: string
}

export default function PublisherDashboard() {
  // Tab state
  const [activeTab, setActiveTab] = useState("overview")
  
  // Overview tab states
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatItem[]>([
    { 
      title: "Total Revenue", 
      value: "--", 
      change: "--", 
      trend: "none", 
      icon: DollarSign 
    },
    { 
      title: "Active Ad Slots", 
      value: "--", 
      change: "--", 
      trend: "none", 
      icon: Newspaper 
    },
    { 
      title: "Total Impressions", 
      value: "--", 
      change: "--", 
      trend: "none", 
      icon: Eye 
    },
    { 
      title: "Avg. Click Rate", 
      value: "--", 
      change: "--", 
      trend: "none", 
      icon: MousePointerClick 
    },
  ])
  const [recentSlots, setRecentSlots] = useState<AdSlot[]>([])
  const [topPerformers, setTopPerformers] = useState<PerformerSlot[]>([])
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  
  // Ad slots tab states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isAdSlotsLoading, setIsAdSlotsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [slots, setSlots] = useState<any[]>([])
  const [transformedSlots, setTransformedSlots] = useState<AdSlotUI[]>([])
  const [slotToDeactivate, setSlotToDeactivate] = useState<AdSlotUI | null>(null)
  const [slotToCloseAuction, setSlotToCloseAuction] = useState<AdSlotUI | null>(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showCloseAuctionDialog, setShowCloseAuctionDialog] = useState(false)
  
  // Create ad slot modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Wallet and program hooks
  const wallet = useWallet()
  const { getPublisherSlots, deactivateSlot, closeAuction } = useAdProgram()
  
  // Fetch overview data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch stats
        // const statsResponse = await fetch('/api/publisher/stats')
        // const statsData = await statsResponse.json()
        // setStats(statsData)
        
        // Fetch recent slots
        // const slotsResponse = await fetch('/api/publisher/slots/recent')
        // const slotsData = await slotsResponse.json()
        // setRecentSlots(slotsData)
        
        // Fetch top performers
        // const performersResponse = await fetch('/api/publisher/slots/top')
        // const performersData = await performersResponse.json()
        // setTopPerformers(performersData)
        
        // Fetch recent payments
        // const paymentsResponse = await fetch('/api/publisher/payments/recent')
        // const paymentsData = await paymentsResponse.json()
        // setRecentPayments(paymentsData)
        
        // For now, just simulate loading
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }
    
    if (activeTab === "overview") {
      fetchDashboardData()
    }
    
    // Optional: Set up polling for real-time updates
    // const interval = setInterval(fetchDashboardData, 10000)
    // return () => clearInterval(interval)
  }, [timeRange, activeTab])
  
  // Fetch ad slots
  useEffect(() => {
    if (activeTab === "ad-slots") {
      fetchAdSlots()
    }
  }, [activeTab, wallet.publicKey])
  
  // Function to fetch ad slots
  const fetchAdSlots = async () => {
    if (!wallet.publicKey) {
      setSlots([])
      setTransformedSlots([])
      setIsAdSlotsLoading(false)
      return
    }

    try {
      setIsAdSlotsLoading(true)
      const fetchedSlots = await getPublisherSlots()
      setSlots(fetchedSlots)

      // Transform blockchain data to UI format
      const transformed = fetchedSlots.map((slot: SlotData) => ({
        id: slot.slot_id,
        publicKey: slot.publicKey,
        name: slot.slot_id, // Using slot_id as name since we don't have a separate name field
        price: `${slot.price.toNumber() / LAMPORTS_PER_SOL} SOL`,
        priceRaw: slot.price.toNumber() / LAMPORTS_PER_SOL,
        duration: `${slot.duration.toNumber()} seconds`,
        durationDays: Math.floor(slot.duration.toNumber() / 86400),
        status: slot.is_active
          ? slot.is_auction
            ? "Auction"
            : "Active"
          : "Inactive",
        type: slot.is_auction ? "Auction" : "Fixed Price",
        impressions: slot.view_count.toNumber(),
        category: slot.category || "General",
        description: `Ad slot with audience size of ${slot.audience_size.toNumber()}`,
        auctionEnd: slot.auction_end.toNumber(),
        highestBid: slot.highest_bid.toNumber() / LAMPORTS_PER_SOL,
        highestBidder: slot.highest_bidder?.toString() || "",
        audienceSize: slot.audience_size.toNumber(),
        ownerAddress: slot.owner.toString(),
      }))

      setTransformedSlots(transformed)
    } catch (error) {
      console.error("Error fetching ad slots:", error)
      toast.error("Failed to fetch ad slots")
    } finally {
      setIsAdSlotsLoading(false)
    }
  }
  
  // Handle deactivating a slot
  const handleDeactivateSlot = async () => {
    if (!slotToDeactivate || !wallet.publicKey) return

    try {
      setIsActionLoading(true)

      toast.loading("Deactivating ad slot... Please approve the transaction")

      const result = await deactivateSlot(slotToDeactivate.publicKey)

      if (result.success) {
        toast.success("Ad slot deactivated successfully!")
        fetchAdSlots() // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deactivating slot:", error)
      toast.error(`Failed to deactivate slot: ${error.message}`)
    } finally {
      setIsActionLoading(false)
      setSlotToDeactivate(null)
      setShowDeactivateDialog(false)
    }
  }

  // Handle closing an auction
  const handleCloseAuction = async () => {
    if (!slotToCloseAuction || !wallet.publicKey) return

    try {
      setIsActionLoading(true)

      toast.loading("Closing auction... Please approve the transaction")

      const result = await closeAuction(slotToCloseAuction.publicKey)

      if (result.success) {
        toast.success("Auction closed successfully!")
        fetchAdSlots() // Refresh the list
      }
    } catch (error: any) {
      console.error("Error closing auction:", error)
      toast.error(`Failed to close auction: ${error.message}`)
    } finally {
      setIsActionLoading(false)
      setSlotToCloseAuction(null)
      setShowCloseAuctionDialog(false)
    }
  }

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Check if auction has ended
  const isAuctionEnded = (auctionEnd: number) => {
    if (!auctionEnd) return false
    return Date.now() / 1000 > auctionEnd
  }
  
  // Filter and sort slots
  const filteredSlots = transformedSlots
    .filter((slot) => {
      // Apply search filter
      if (
        searchQuery &&
        !slot.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !slot.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Apply status filter
      if (
        statusFilter !== "all" &&
        slot.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "price-high":
          return b.priceRaw - a.priceRaw
        case "price-low":
          return a.priceRaw - b.priceRaw
        case "impressions":
          return b.impressions - a.impressions
        case "duration":
          return b.durationDays - a.durationDays
        case "oldest":
          return a.id.localeCompare(b.id)
        case "newest":
        default:
          return b.id.localeCompare(a.id)
      }
    })
  
  // Handle create ad slot success
  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchAdSlots()
    toast.success("Ad slot created successfully!")
  }
  return (
    <div className="space-y-8 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Publisher Dashboard</h1>
          <p className="text-white/60">Monitor your ad slots and earnings</p>
        </div>
        <div className="flex gap-2">
          <RoleSwitcher currentRole="publisher" />
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10 hover:shadow-white/20 transition-all rounded-md">
                <Plus className="h-4 w-4 mr-2" />
                Create Ad Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-xl text-white">Create New Ad Slot</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new ad slot for advertisers to purchase
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <AdSlotForm onSuccess={handleCreateSuccess} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 bg-gray-800 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="ad-slots" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Ad Slots
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-white/60" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-white/60 flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : stat.trend === "down" ? (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      ) : null}
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Ad Slots */}
            <Card className="lg:col-span-2 bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Recent Ad Slots</CardTitle>
                  <Button 
                    variant="link" 
                    className="text-white hover:text-white/80 p-0"
                    onClick={() => setActiveTab("ad-slots")}
                  >
                    View All
                  </Button>
                </div>
                <CardDescription className="text-white/60">
                  Your recently created ad slots
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center text-white/60 py-4">Loading ad slots...</div>
                ) : recentSlots.length > 0 ? (
                  <div className="space-y-4">
                    {recentSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-800/50 hover:border-gray-700/50 transition-all"
                      >
                        <div>
                          <h3 className="font-medium text-white">{slot.name}</h3>
                          <p className="text-sm text-white/60">
                            {slot.price} • {slot.duration || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              slot.status === "Active"
                                ? "bg-green-900/30 text-green-400"
                                : slot.status === "Auction"
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-yellow-900/30 text-yellow-400"
                            }`}
                          >
                            {slot.status}
                          </span>
                          <span className="text-xs text-white/60 mt-1">
                            Created: {slot.created}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-4">
                    No ad slots found. Create your first ad slot to get started.
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Top Performing Slots */}
            <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Top Performers</CardTitle>
                <CardDescription className="text-white/60">
                  Top performing ad slots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="text-center text-white/60 py-4">Loading performance data...</div>
                ) : topPerformers.length > 0 ? (
                  topPerformers.map((performer, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{performer.name}</span>
                        <span className="text-sm text-white/60">{performer.revenue} SOL</span>
                      </div>
                      <Progress value={performer.ctr * 20} className="h-2 bg-gray-800 rounded-full" />
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>CTR: {performer.ctr}%</span>
                        <span>Revenue: {performer.revenue} SOL</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white/60 py-4">No performance data available</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Payments */}
          <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Recent Payments</CardTitle>
                <Button variant="link" className="text-white hover:text-white/80 p-0">
                  View All
                </Button>
              </div>
              <CardDescription className="text-white/60">
                Recent payments received from advertisers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-white/60 font-medium">ID</th>
                      <th className="text-left p-4 text-white/60 font-medium">Amount</th>
                      <th className="text-left p-4 text-white/60 font-medium">From</th>
                      <th className="text-left p-4 text-white/60 font-medium">Date</th>
                      <th className="text-left p-4 text-white/60 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="border-b border-gray-800">
                        <td colSpan={5} className="p-4 text-center text-white/60">Loading payment data...</td>
                      </tr>
                    ) : recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-800 hover:bg-[#1a1f3d]/50">
                          <td className="p-4 font-mono text-sm text-white">{payment.id}</td>
                          <td className="p-4 font-medium text-white">{payment.amount}</td>
                          <td className="p-4 font-mono text-sm text-white">{payment.from}</td>
                          <td className="p-4 text-white/60">{payment.date}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-800">
                        <td colSpan={5} className="p-4 text-center text-white/60">No payment data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ad Slots Tab Content */}
        <TabsContent value="ad-slots" className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search slots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700 text-white w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="auction">Auction</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-high">Price (High)</SelectItem>
                  <SelectItem value="price-low">Price (Low)</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchAdSlots}
                disabled={isAdSlotsLoading}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
              >
                {isAdSlotsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10 hover:shadow-white/20 transition-all rounded-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ad Slot
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-white">Create New Ad Slot</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Create a new ad slot for advertisers to purchase
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <AdSlotForm onSuccess={handleCreateSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Ad Slots List */}
          <div className="space-y-4">
            {isAdSlotsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                <span className="ml-2 text-white/60">Loading ad slots...</span>
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-800">
                <Newspaper className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-xl font-medium text-white mb-1">No ad slots found</h3>
                <p className="text-white/60 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters or create a new ad slot."
                    : "Create your first ad slot to get started."}
                </p>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ad Slot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-white">Create New Ad Slot</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a new ad slot for advertisers to purchase
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <AdSlotForm onSuccess={handleCreateSuccess} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <>
                {/* Alert Dialogs */}
                <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Ad Slot</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to deactivate this ad slot? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeactivateSlot}
                        disabled={isActionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isActionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deactivating...
                          </>
                        ) : (
                          "Deactivate"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <AlertDialog open={showCloseAuctionDialog} onOpenChange={setShowCloseAuctionDialog}>
                  <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Close Auction</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to close this auction? This will finalize the highest bid and deactivate the slot.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCloseAuction}
                        disabled={isActionLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isActionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Closing...
                          </>
                        ) : (
                          "Close Auction"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                {/* Ad Slots */}
                {filteredSlots.map((slot) => (
                  <Card key={slot.id} className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-white">{slot.name}</h3>
                            <p className="text-sm text-gray-400">{slot.description}</p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {slot.status === "Active" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSlotToDeactivate(slot)
                                    setShowDeactivateDialog(true)
                                  }}
                                  className="cursor-pointer hover:bg-gray-700"
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              {slot.status === "Auction" && isAuctionEnded(slot.auctionEnd) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSlotToCloseAuction(slot)
                                    setShowCloseAuctionDialog(true)
                                  }}
                                  className="cursor-pointer hover:bg-gray-700"
                                >
                                  Close Auction
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-400">Price</p>
                            <p className="font-medium">{slot.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="font-medium">{slot.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Category</p>
                            <p className="font-medium">{slot.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Audience Size</p>
                            <p className="font-medium">
                              {slot.audienceSize.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {slot.type === "Auction" && (
                          <div className="mt-4 p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-300">Auction End</p>
                                <p className="font-medium">
                                  {formatTimestamp(slot.auctionEnd)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-300">Highest Bid</p>
                                <p className="font-medium">{slot.highestBid} SOL</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-300">Status</p>
                                <p className="font-medium">
                                  {isAuctionEnded(slot.auctionEnd) ? (
                                    <span className="text-yellow-400">
                                      Ended (needs closing)
                                    </span>
                                  ) : (
                                    <span className="text-green-400">Active</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stats sidebar */}
                      <div className="md:w-64 bg-gray-750 p-4 flex flex-row md:flex-col justify-between border-t md:border-t-0 md:border-l border-gray-700">
                        <div className="text-center p-2">
                          <p className="text-sm text-gray-400">Impressions</p>
                          <p className="text-xl font-bold">
                            {slot.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-2">
                          <p className="text-sm text-gray-400">Price</p>
                          <p className="text-xl font-bold">{slot.price}</p>
                        </div>
                        <div className="text-center p-2">
                          <p className="text-sm text-gray-400">Status</p>
                          <p className="text-xl font-bold">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                slot.status === "Active"
                                  ? "bg-green-900/30 text-green-400"
                                  : slot.status === "Auction"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-yellow-900/30 text-yellow-400"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
