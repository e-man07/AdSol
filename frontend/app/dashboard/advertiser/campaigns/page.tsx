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
  Play,
  Pause,
  Calendar
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
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  
  // Mock data for campaigns
  const allCampaigns = [
    { 
      id: "camp-001", 
      name: "Summer Sale Promotion", 
      budget: "500 SOL", 
      budgetRaw: 500,
      spent: "125.5 SOL", 
      spentRaw: 125.5,
      status: "Active", 
      impressions: 450000, 
      clicks: 12600,
      ctr: "2.8%",
      startDate: "2025-06-01",
      endDate: "2025-06-30",
      created: "2025-05-15T10:30:00Z",
      adCount: 5,
      targetAudience: "Technology enthusiasts",
      description: "Promoting summer sale across technology websites"
    },
    { 
      id: "camp-002", 
      name: "New Product Launch", 
      budget: "750 SOL", 
      budgetRaw: 750,
      spent: "320.8 SOL", 
      spentRaw: 320.8,
      status: "Active", 
      impressions: 980000, 
      clicks: 29400,
      ctr: "3.0%",
      startDate: "2025-05-15",
      endDate: "2025-07-15",
      created: "2025-05-10T14:20:00Z",
      adCount: 8,
      targetAudience: "Early adopters, Tech professionals",
      description: "Launch campaign for our new flagship product"
    },
    { 
      id: "camp-003", 
      name: "Brand Awareness", 
      budget: "300 SOL", 
      budgetRaw: 300,
      spent: "85.2 SOL", 
      spentRaw: 85.2,
      status: "Active", 
      impressions: 210000, 
      clicks: 5250,
      ctr: "2.5%",
      startDate: "2025-05-10",
      endDate: "2025-06-10",
      created: "2025-05-05T09:15:00Z",
      adCount: 3,
      targetAudience: "General audience",
      description: "Increasing brand visibility across multiple platforms"
    },
    { 
      id: "camp-004", 
      name: "Limited Time Offer", 
      budget: "200 SOL", 
      budgetRaw: 200,
      spent: "0 SOL", 
      spentRaw: 0,
      status: "Scheduled", 
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      created: "2025-05-18T16:45:00Z",
      adCount: 2,
      targetAudience: "Existing customers",
      description: "Flash sale promotion for existing customers"
    },
    { 
      id: "camp-005", 
      name: "Holiday Special", 
      budget: "600 SOL", 
      budgetRaw: 600,
      spent: "0 SOL", 
      spentRaw: 0,
      status: "Draft", 
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      created: "2025-05-01T11:30:00Z",
      adCount: 0,
      targetAudience: "Holiday shoppers",
      description: "End of year holiday promotion"
    },
    { 
      id: "camp-006", 
      name: "Retargeting Campaign", 
      budget: "250 SOL", 
      budgetRaw: 250,
      spent: "125.5 SOL", 
      spentRaw: 125.5,
      status: "Paused", 
      impressions: 180000, 
      clicks: 9000,
      ctr: "5.0%",
      startDate: "2025-04-01",
      endDate: "2025-05-15",
      created: "2025-03-25T08:00:00Z",
      adCount: 4,
      targetAudience: "Website visitors who didn't convert",
      description: "Retargeting campaign for users who visited but didn't purchase"
    },
  ]
  
  // Filter and sort campaigns
  const filteredCampaigns = allCampaigns
    .filter(campaign => {
      // Apply status filter
      if (statusFilter !== "all" && campaign.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      
      // Apply search filter
      if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !campaign.id.toLowerCase().includes(searchQuery.toLowerCase())) {
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
        case "budget-high":
          return b.budgetRaw - a.budgetRaw
        case "budget-low":
          return a.budgetRaw - b.budgetRaw
        case "performance":
          return parseFloat(b.ctr) - parseFloat(a.ctr)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-400">Manage your advertising campaigns</p>
        </div>
        <Link href="/dashboard/advertiser/campaigns/create">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
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
                placeholder="Search campaigns..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="budget-high">Budget (High to Low)</SelectItem>
                  <SelectItem value="budget-low">Budget (Low to High)</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-700 p-3 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                No campaigns match your current filters. Try adjusting your search or create a new campaign.
              </p>
              <Link href="/dashboard/advertiser/campaigns/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{campaign.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.status === "Active" 
                              ? "bg-green-900/30 text-green-400" 
                              : campaign.status === "Scheduled" 
                                ? "bg-blue-900/30 text-blue-400"
                                : campaign.status === "Paused"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : campaign.status === "Draft"
                                    ? "bg-gray-900/30 text-gray-400"
                                    : "bg-purple-900/30 text-purple-400"
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{campaign.id}</p>
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
                          {campaign.status === "Active" && (
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                              <Pause className="mr-2 h-4 w-4" />
                              <span>Pause</span>
                            </DropdownMenuItem>
                          )}
                          {campaign.status === "Paused" && (
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                              <Play className="mr-2 h-4 w-4" />
                              <span>Resume</span>
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
                        <p className="text-sm text-gray-400">Budget / Spent</p>
                        <p className="font-medium">{campaign.spent} / {campaign.budget}</p>
                        <Progress 
                          value={(campaign.spentRaw / campaign.budgetRaw) * 100} 
                          className="h-1 mt-1 bg-gray-700" 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Ads</p>
                        <p className="font-medium">{campaign.adCount} ads</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Target Audience</p>
                        <p className="font-medium">{campaign.targetAudience}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-4">{campaign.description}</p>
                  </div>
                  
                  {/* Stats sidebar */}
                  <div className="md:w-64 bg-gray-750 p-4 flex flex-row md:flex-col justify-between border-t md:border-t-0 md:border-l border-gray-700">
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Impressions</p>
                      <p className="text-xl font-bold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">Clicks</p>
                      <p className="text-xl font-bold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-400">CTR</p>
                      <p className="text-xl font-bold">{campaign.ctr}</p>
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
