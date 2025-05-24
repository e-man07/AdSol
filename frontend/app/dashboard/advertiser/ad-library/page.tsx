"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Copy
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
import Image from "next/image"

export default function AdLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")
  
  // Mock data for ads
  const allAds = [
    { 
      id: "ad-001", 
      name: "Summer Sale Banner", 
      type: "Image",
      format: "Banner",
      dimensions: "728x90",
      campaign: "Summer Sale Promotion",
      campaignId: "camp-001",
      impressions: 125000, 
      clicks: 3750,
      ctr: "3.0%",
      created: "2025-05-15T10:30:00Z",
      ipfsCid: "QmX7b5QEJZxg9VEe9HjbvQaBQTaxEKGQkFKTvGF8iGzRPj",
      previewUrl: "https://placehold.co/728x90/3d1d6d/ffffff?text=Summer+Sale+Banner",
      status: "Active"
    },
    { 
      id: "ad-002", 
      name: "Product Demo Video", 
      type: "Video",
      format: "Pre-roll",
      dimensions: "640x360",
      campaign: "New Product Launch",
      campaignId: "camp-002",
      impressions: 85000, 
      clicks: 3400,
      ctr: "4.0%",
      created: "2025-05-12T14:20:00Z",
      ipfsCid: "QmYvKTe9VpwSxm4hQyVYS6a1fA5R7S9XZJDzCYGGEyXJKj",
      previewUrl: "https://placehold.co/640x360/3d1d6d/ffffff?text=Product+Demo+Video",
      status: "Active"
    },
    { 
      id: "ad-003", 
      name: "Brand Awareness Sidebar", 
      type: "Image",
      format: "Rectangle",
      dimensions: "300x250",
      campaign: "Brand Awareness",
      campaignId: "camp-003",
      impressions: 210000, 
      clicks: 5250,
      ctr: "2.5%",
      created: "2025-05-10T09:15:00Z",
      ipfsCid: "QmT8JKRLdGqXjqT5XpvBx1g9yrAYcXZSJNKQS4yFJf3qZk",
      previewUrl: "https://placehold.co/300x250/3d1d6d/ffffff?text=Brand+Awareness",
      status: "Active"
    },
    { 
      id: "ad-004", 
      name: "Limited Time Offer Mobile", 
      type: "Image",
      format: "Interstitial",
      dimensions: "320x480",
      campaign: "Limited Time Offer",
      campaignId: "camp-004",
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      created: "2025-05-18T16:45:00Z",
      ipfsCid: "QmVJZLbPbjKqxXhTVxo9C8EyVBgxj91KvQJZKBxNdyN1Qm",
      previewUrl: "https://placehold.co/320x480/3d1d6d/ffffff?text=Limited+Time+Offer",
      status: "Scheduled"
    },
    { 
      id: "ad-005", 
      name: "Holiday Special Animation", 
      type: "HTML5",
      format: "Interactive",
      dimensions: "300x600",
      campaign: "Holiday Special",
      campaignId: "camp-005",
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      created: "2025-05-01T11:30:00Z",
      ipfsCid: "QmPZLywrJVrNrKLwgwkE4a84JC3iFgq9UPJ6dJhYYpd7Zk",
      previewUrl: "https://placehold.co/300x600/3d1d6d/ffffff?text=Holiday+Special",
      status: "Draft"
    },
    { 
      id: "ad-006", 
      name: "Retargeting Banner", 
      type: "Image",
      format: "Banner",
      dimensions: "468x60",
      campaign: "Retargeting Campaign",
      campaignId: "camp-006",
      impressions: 180000, 
      clicks: 9000,
      ctr: "5.0%",
      created: "2025-03-25T08:00:00Z",
      ipfsCid: "QmXjKTvGqwsQySZGQJBcLqYCHEbQMXQsJQKL8yYZJNWpZm",
      previewUrl: "https://placehold.co/468x60/3d1d6d/ffffff?text=Retargeting+Banner",
      status: "Paused"
    },
  ]
  
  // Filter and sort ads
  const filteredAds = allAds
    .filter(ad => {
      // Apply tab filter
      if (activeTab !== "all" && ad.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false
      }
      
      // Apply type filter
      if (typeFilter !== "all" && ad.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false
      }
      
      // Apply search filter
      if (searchQuery && !ad.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !ad.id.toLowerCase().includes(searchQuery.toLowerCase())) {
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
        case "performance":
          return parseFloat(b.ctr) - parseFloat(a.ctr)
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
          <h1 className="text-2xl font-bold">Ad Library</h1>
          <p className="text-gray-400">Manage your ad creatives</p>
        </div>
        <Link href="/dashboard/advertiser/ad-library/create">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Ad
          </Button>
        </Link>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start rounded-none p-0">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-3 px-6"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-3 px-6"
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="scheduled" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-3 px-6"
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger 
            value="draft" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-3 px-6"
          >
            Draft
          </TabsTrigger>
          <TabsTrigger 
            value="paused" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 py-3 px-6"
          >
            Paused
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search ads..."
                className="pl-8 bg-gray-700 border-gray-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="html5">HTML5</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Ad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.length === 0 ? (
          <Card className="col-span-full bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-700 p-3 mb-4">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No ads found</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                No ads match your current filters. Try adjusting your search or create a new ad.
              </p>
              <Link href="/dashboard/advertiser/ad-library/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ad
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredAds.map((ad) => (
              <Card key={ad.id} className="bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
                {/* Ad Preview */}
                <div className="relative w-full bg-gray-900 flex items-center justify-center p-4" style={{ minHeight: "200px" }}>
                  {ad.type === "Video" ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image 
                          src={ad.previewUrl} 
                          alt={ad.name}
                          width={300}
                          height={200}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <Image 
                      src={ad.previewUrl} 
                      alt={ad.name}
                      width={300}
                      height={200}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.status === "Active" 
                        ? "bg-green-900/30 text-green-400" 
                        : ad.status === "Scheduled" 
                          ? "bg-blue-900/30 text-blue-400"
                          : ad.status === "Paused"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-gray-900/30 text-gray-400"
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{ad.name}</CardTitle>
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
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View on IPFS</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-gray-700 hover:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-gray-400">
                    {ad.type} • {ad.format} • {ad.dimensions}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2 flex-grow">
                  <div className="text-sm text-gray-400">
                    <p>Campaign: {ad.campaign}</p>
                    <p className="mt-1 font-mono text-xs truncate" title={ad.ipfsCid}>
                      IPFS: {ad.ipfsCid.substring(0, 16)}...
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 border-t border-gray-700 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Impressions</p>
                    <p className="font-medium">{ad.impressions.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Clicks</p>
                    <p className="font-medium">{ad.clicks.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">CTR</p>
                    <p className="font-medium">{ad.ctr}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
