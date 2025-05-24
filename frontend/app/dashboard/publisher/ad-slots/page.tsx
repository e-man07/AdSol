"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function AdSlotsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  
  // Mock data for ad slots
  const allSlots = [
    { 
      id: "slot-001", 
      name: "Homepage Banner", 
      price: "0.5 SOL", 
      priceRaw: 0.5,
      duration: "7 days", 
      durationDays: 7,
      status: "Active", 
      type: "Fixed Price",
      impressions: 12500, 
      clicks: 380,
      ctr: "3.04%",
      revenue: "0.5 SOL",
      created: "2025-05-15T10:30:00Z",
      dimensions: "728x90",
      category: "Technology",
      description: "Premium banner position at the top of the homepage"
    },
    { 
      id: "slot-002", 
      name: "Sidebar Premium", 
      price: "0.3 SOL", 
      priceRaw: 0.3,
      duration: "14 days", 
      durationDays: 14,
      status: "Active", 
      type: "Fixed Price",
      impressions: 8200, 
      clicks: 245,
      ctr: "2.99%",
      revenue: "0.3 SOL",
      created: "2025-05-12T14:20:00Z",
      dimensions: "300x250",
      category: "Technology",
      description: "High-visibility sidebar position on all article pages"
    },
    { 
      id: "slot-003", 
      name: "Article Footer", 
      price: "0.2 SOL", 
      priceRaw: 0.2,
      duration: "30 days", 
      durationDays: 30,
      status: "Auction", 
      type: "Auction",
      impressions: 5100, 
      clicks: 102,
      ctr: "2.00%",
      revenue: "0.2 SOL",
      created: "2025-05-10T09:15:00Z",
      dimensions: "600x200",
      category: "Finance",
      description: "Footer position on all finance article pages"
    },
    { 
      id: "slot-004", 
      name: "Mobile Interstitial", 
      price: "0.4 SOL", 
      priceRaw: 0.4,
      duration: "10 days", 
      durationDays: 10,
      status: "Pending", 
      type: "Fixed Price",
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      revenue: "0 SOL",
      created: "2025-05-19T16:45:00Z",
      dimensions: "320x480",
      category: "Mobile",
      description: "Full-screen mobile interstitial shown between page transitions"
    },
    { 
      id: "slot-005", 
      name: "Video Pre-roll", 
      price: "0.6 SOL", 
      priceRaw: 0.6,
      duration: "5 days", 
      durationDays: 5,
      status: "Inactive", 
      type: "Fixed Price",
      impressions: 3200, 
      clicks: 128,
      ctr: "4.00%",
      revenue: "0.6 SOL",
      created: "2025-05-05T11:30:00Z",
      dimensions: "640x360",
      category: "Video",
      description: "5-second pre-roll video ad before content videos"
    },
    { 
      id: "slot-006", 
      name: "Newsletter Sponsorship", 
      price: "0.8 SOL", 
      priceRaw: 0.8,
      duration: "1 days", 
      durationDays: 1,
      status: "Sold", 
      type: "Auction",
      impressions: 15000, 
      clicks: 525,
      ctr: "3.50%",
      revenue: "1.2 SOL",
      created: "2025-05-01T08:00:00Z",
      dimensions: "600x200",
      category: "Email",
      description: "Sponsorship position in daily newsletter"
    },
  ]
  
  // Filter and sort slots
  const filteredSlots = allSlots
    .filter(slot => {
      // Apply status filter
      if (statusFilter !== "all" && slot.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      
      // Apply search filter
      if (searchQuery && !slot.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !slot.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "newest":
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        case "oldest":
          return new Date(a.created).getTime() - new Date(b.created).getTime()
        case "price-high":
          return b.priceRaw - a.priceRaw
        case "price-low":
          return a.priceRaw - b.priceRaw
        case "duration":
          return a.durationDays - b.durationDays
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
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search ad slots..."
                className="pl-8 bg-gray-700 border-gray-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="auction">Auction</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Ad Slots List */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            slot.status === "Active" 
                              ? "bg-green-900/30 text-green-400" 
                              : slot.status === "Auction" 
                                ? "bg-blue-900/30 text-blue-400"
                                : slot.status === "Sold"
                                  ? "bg-purple-900/30 text-purple-400"
                                  : slot.status === "Inactive"
                                    ? "bg-gray-900/30 text-gray-400"
                                    : "bg-yellow-900/30 text-yellow-400"
                          }`}>
                            {slot.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            {slot.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{slot.id}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {slot.status === "Active" && (
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                              <X className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                          )}
                          {slot.status === "Inactive" && (
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                              <Check className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-gray-700 hover:text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
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
                        <p className="text-sm text-gray-400">Dimensions</p>
                        <p className="font-medium">{slot.dimensions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-medium">{slot.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-4">{slot.description}</p>
                  </div>
                  
                  {/* Stats sidebar */}
                  <div className="md:w-64 bg-gray-750 p-4 flex flex-row md:flex-col justify-between border-t md:border-t-0 md:border-l border-gray-700">
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Impressions</p>
                      <p className="text-xl font-bold">{slot.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Clicks</p>
                      <p className="text-xl font-bold">{slot.clicks.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">CTR</p>
                      <p className="text-xl font-bold">{slot.ctr}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="text-xl font-bold">{slot.revenue}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
