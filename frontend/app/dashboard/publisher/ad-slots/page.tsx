"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye,
  ArrowUpDown,
  Check,
  X,
  Clock,
  Loader2,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useAdProgram } from "@/utils/solana-program"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Define types for our ad slot
interface SlotData {
  publicKey: PublicKey;
  owner: PublicKey;
  slot_id: string;
  price: { toNumber: () => number };
  duration: { toNumber: () => number };
  is_auction: boolean;
  auction_end: { toNumber: () => number };
  highest_bid: { toNumber: () => number };
  highest_bidder?: PublicKey;
  is_active: boolean;
  view_count: { toNumber: () => number };
  category: string;
  audience_size: { toNumber: () => number };
}

interface AdSlotUI {
  id: string;
  publicKey: PublicKey;
  name: string;
  price: string;
  priceRaw: number;
  duration: string;
  durationDays: number;
  status: string;
  type: string;
  impressions: number;
  category: string;
  description: string;
  auctionEnd: number;
  highestBid: number;
  highestBidder: string;
  audienceSize: number;
  ownerAddress: string;
}

export default function AdSlotsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [slots, setSlots] = useState<any[]>([])
  const [transformedSlots, setTransformedSlots] = useState<AdSlotUI[]>([])
  const [slotToDeactivate, setSlotToDeactivate] = useState<AdSlotUI | null>(null)
  const [slotToCloseAuction, setSlotToCloseAuction] = useState<AdSlotUI | null>(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showCloseAuctionDialog, setShowCloseAuctionDialog] = useState(false)
  
  const wallet = useWallet()
  const { getPublisherSlots, deactivateSlot, closeAuction } = useAdProgram()
  
  // Function to fetch ad slots
  const fetchAdSlots = async () => {
    if (!wallet.publicKey) {
      setSlots([])
      setTransformedSlots([])
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
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
        status: slot.is_active ? (slot.is_auction ? "Auction" : "Active") : "Inactive",
        type: slot.is_auction ? "Auction" : "Fixed Price",
        impressions: slot.view_count.toNumber(),
        category: slot.category || "General",
        description: `Ad slot with audience size of ${slot.audience_size.toNumber()}`,
        auctionEnd: slot.auction_end.toNumber(),
        highestBid: slot.highest_bid.toNumber() / LAMPORTS_PER_SOL,
        highestBidder: slot.highest_bidder?.toString() || "",
        audienceSize: slot.audience_size.toNumber(),
        ownerAddress: slot.owner.toString()
      }))
      
      setTransformedSlots(transformed)
    } catch (error) {
      console.error('Error fetching ad slots:', error)
      toast.error('Failed to fetch ad slots')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch slots on component mount and when wallet changes
  useEffect(() => {
    fetchAdSlots()
    
    // Set up polling every 10 seconds to refresh data
    const intervalId = setInterval(fetchAdSlots, 10000)
    
    return () => clearInterval(intervalId)
  }, [wallet.publicKey])
  
  // Handle deactivating a slot
  const handleDeactivateSlot = async () => {
    if (!slotToDeactivate || !wallet.publicKey) return
    
    try {
      setIsActionLoading(true)
      
      toast.loading('Deactivating ad slot... Please approve the transaction')
      
      const result = await deactivateSlot(slotToDeactivate.publicKey)
      
      if (result.success) {
        toast.success('Ad slot deactivated successfully!')
        fetchAdSlots() // Refresh the list
      }
    } catch (error: any) {
      console.error('Error deactivating slot:', error)
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
      
      toast.loading('Closing auction... Please approve the transaction')
      
      const result = await closeAuction(slotToCloseAuction.publicKey)
      
      if (result.success) {
        toast.success('Auction closed successfully!')
        fetchAdSlots() // Refresh the list
      }
    } catch (error: any) {
      console.error('Error closing auction:', error)
      toast.error(`Failed to close auction: ${error.message}`)
    } finally {
      setIsActionLoading(false)
      setSlotToCloseAuction(null)
      setShowCloseAuctionDialog(false)
    }
  }
  
  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleString()
  }
  
  // Check if auction has ended
  const isAuctionEnded = (auctionEnd: number) => {
    if (!auctionEnd) return false
    return Date.now() / 1000 > auctionEnd
  }
  
  // Filter and sort slots
  const filteredSlots = transformedSlots
    .filter(slot => {
      // Apply status filter
      if (statusFilter !== "all" && slot.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          slot.id.toLowerCase().includes(query) ||
          slot.name.toLowerCase().includes(query) ||
          slot.category.toLowerCase().includes(query) ||
          slot.description.toLowerCase().includes(query)
        )
      }
      
      return true
    })
    .sort((a: AdSlotUI, b: AdSlotUI) => {
      // Apply sorting
      switch (sortBy) {
        case "newest":
          // Since we don't have creation timestamps, use alphabetical order
          return a.id.localeCompare(b.id) * -1
        case "oldest":
          return a.id.localeCompare(b.id)
        case "price-high":
          return b.priceRaw - a.priceRaw
        case "price-low":
          return a.priceRaw - b.priceRaw
        case "impressions":
          return b.impressions - a.impressions
        default:
          return 0
      }
    })
    

return (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Ad Slots</h1>
        <p className="text-gray-400">Manage your ad inventory</p>
      </div>
      <Link href="/dashboard/publisher/ad-slots/create">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Ad Slot
        </Button>
      </Link>
    </div>
    
    {/* Filters */}
    <Card className="bg-gray-800 border-gray-700">
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search ad slots..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-high">Price (High)</SelectItem>
                <SelectItem value="price-low">Price (Low)</SelectItem>
                <SelectItem value="impressions">Impressions</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              onClick={fetchAdSlots}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Link href="/dashboard/publisher/ad-slots/create">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
        
      </div>
    </Card>
    
    {/* Alert Dialogs for Confirmation */}
    <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Ad Slot</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to deactivate this ad slot? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeactivateSlot}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              'Deactivate'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <AlertDialog open={showCloseAuctionDialog} onOpenChange={setShowCloseAuctionDialog}>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Close Auction</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to close this auction? This will finalize the highest bid and deactivate the slot.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCloseAuction}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              'Close Auction'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
            <p className="text-gray-400">Loading ad slots...</p>
          </div>
        ) : filteredSlots.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-700 p-3 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No ad slots found</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                No ad slots match your current filters. Try adjusting your search or create a new ad slot.
              </p>
              <Link href="/dashboard/publisher/ad-slots/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ad Slot
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredSlots.map((slot) => (
              <Card key={slot.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{slot.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{slot.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          slot.status === "Active" 
                            ? "bg-green-900/30 text-green-400" 
                            : slot.status === "Auction" 
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-yellow-900/30 text-yellow-400"
                        }`}>
                          {slot.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          {slot.type}
                        </span>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuLabel className="text-gray-400">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          
                          {slot.status === "Active" && (
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-gray-700"
                                onClick={() => setSlotToDeactivate(slot)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                <span>Deactivate</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          )}
                          
                          {slot.status === "Auction" && isAuctionEnded(slot.auctionEnd) && (
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-gray-700"
                                onClick={() => setSlotToCloseAuction(slot)}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Close Auction</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
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
                        <p className="font-medium">{slot.audienceSize.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {slot.type === "Auction" && (
                      <div className="mt-4 p-3 bg-blue-900/20 rounded-md border border-blue-800/30">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-300">Auction End</p>
                            <p className="font-medium">{formatTimestamp(slot.auctionEnd)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">Highest Bid</p>
                            <p className="font-medium">{slot.highestBid} SOL</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">Status</p>
                            <p className="font-medium">
                              {isAuctionEnded(slot.auctionEnd) ? (
                                <span className="text-yellow-400">Ended (needs closing)</span>
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
                      <p className="text-xl font-bold">{slot.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-xl font-bold">{slot.price}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-xl font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          slot.status === "Active" 
                            ? "bg-green-900/30 text-green-400" 
                            : slot.status === "Auction" 
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-yellow-900/30 text-yellow-400"
                        }`}>
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
  )
}
