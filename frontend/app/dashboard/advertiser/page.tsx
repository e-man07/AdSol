"use client"

import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Megaphone, 
  ArrowUp, 
  ArrowDown,
  Eye,
  MousePointerClick,
  Target,
  Plus,
  ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import AdvertiserDashboard from "@/components/advertiser/AdvertiserDashboard"

export default function AdvertiserDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")
  
  // Mock data for the dashboard
  const stats = [
    { 
      title: "Total Spent", 
      value: "2,145.32 SOL", 
      change: "+18.2%", 
      trend: "up", 
      icon: DollarSign 
    },
    { 
      title: "Active Campaigns", 
      value: "8", 
      change: "+2", 
      trend: "up", 
      icon: Megaphone 
    },
    { 
      title: "Total Impressions", 
      value: "3.8M", 
      change: "+12.4%", 
      trend: "up", 
      icon: Eye 
    },
    { 
      title: "Avg. Click Rate", 
      value: "2.8%", 
      change: "+0.3%", 
      trend: "up", 
      icon: MousePointerClick 
    },
  ]
  
  const activeCampaigns = [
    { 
      id: "camp-001", 
      name: "Summer Sale Promotion", 
      budget: "500 SOL", 
      spent: "125.5 SOL", 
      status: "Active", 
      impressions: 450000, 
      clicks: 12600,
      ctr: "2.8%",
      startDate: "Jun 1, 2025",
      endDate: "Jun 30, 2025"
    },
    { 
      id: "camp-002", 
      name: "New Product Launch", 
      budget: "750 SOL", 
      spent: "320.8 SOL", 
      status: "Active", 
      impressions: 980000, 
      clicks: 29400,
      ctr: "3.0%",
      startDate: "May 15, 2025",
      endDate: "Jul 15, 2025"
    },
    { 
      id: "camp-003", 
      name: "Brand Awareness", 
      budget: "300 SOL", 
      spent: "85.2 SOL", 
      status: "Active", 
      impressions: 210000, 
      clicks: 5250,
      ctr: "2.5%",
      startDate: "May 10, 2025",
      endDate: "Jun 10, 2025"
    },
    { 
      id: "camp-004", 
      name: "Limited Time Offer", 
      budget: "200 SOL", 
      spent: "45.3 SOL", 
      status: "Scheduled", 
      impressions: 0, 
      clicks: 0,
      ctr: "0%",
      startDate: "Jun 15, 2025",
      endDate: "Jun 30, 2025"
    },
  ]
  
  const adPerformance = [
    { name: "Banner Ad - Summer Sale", impressions: 250000, clicks: 8750, ctr: 3.5 },
    { name: "Video Ad - Product Demo", impressions: 180000, clicks: 7200, ctr: 4.0 },
    { name: "Sidebar Ad - Discount", impressions: 320000, clicks: 8000, ctr: 2.5 },
    { name: "Mobile Ad - App Install", impressions: 420000, clicks: 10500, ctr: 2.5 },
    { name: "Native Ad - Article", impressions: 150000, clicks: 4500, ctr: 3.0 },
  ]
  
  const recentBids = [
    { id: "bid-001", slot: "Homepage Banner", amount: "0.8 SOL", date: "Today", status: "Won" },
    { id: "bid-002", slot: "Video Pre-roll", amount: "1.2 SOL", date: "Yesterday", status: "Won" },
    { id: "bid-003", slot: "Sidebar Premium", amount: "0.5 SOL", date: "2 days ago", status: "Outbid" },
    { id: "bid-004", slot: "Mobile Interstitial", amount: "0.9 SOL", date: "3 days ago", status: "Active" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advertiser Dashboard</h1>
          <p className="text-gray-400">Manage your campaigns and ad performance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/advertiser/campaigns/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
          <Link href="/dashboard/advertiser/ad-library/create">
            <Button variant="outline" className="border-gray-600">
              <ImageIcon className="mr-2 h-4 w-4" />
              Create Ad
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Active Campaigns</CardTitle>
              <Link href="/dashboard/advertiser/campaigns">
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-400">
              Your currently running and scheduled campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium">Campaign</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Budget/Spent</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Impressions</th>
                    <th className="text-left p-4 text-gray-400 font-medium">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-4">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-400">{campaign.startDate} - {campaign.endDate}</div>
                      </td>
                      <td className="p-4">
                        <div>{campaign.spent}</div>
                        <div className="text-sm text-gray-400">of {campaign.budget}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === "Active" 
                            ? "bg-green-900/30 text-green-400" 
                            : "bg-blue-900/30 text-blue-400"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4">{campaign.impressions.toLocaleString()}</td>
                      <td className="p-4">{campaign.ctr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Ad Performance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Ad Performance</CardTitle>
            <CardDescription className="text-gray-400">
              Top performing ads by CTR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {adPerformance.map((ad, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ad.name}</span>
                  <span className="text-sm text-gray-400">{ad.ctr}% CTR</span>
                </div>
                <Progress value={ad.ctr * 20} className="h-2 bg-gray-700" />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Impressions: {ad.impressions.toLocaleString()}</span>
                  <span>Clicks: {ad.clicks.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bids */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bids</CardTitle>
            <Link href="/dashboard/advertiser/marketplace">
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                View Marketplace
              </Button>
            </Link>
          </div>
          <CardDescription className="text-gray-400">
            Your recent bids on ad slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Ad Slot</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Bid Amount</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBids.map((bid) => (
                  <tr key={bid.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4 font-mono text-sm">{bid.id}</td>
                    <td className="p-4 font-medium">{bid.slot}</td>
                    <td className="p-4">{bid.amount}</td>
                    <td className="p-4 text-gray-400">{bid.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bid.status === "Won" 
                          ? "bg-green-900/30 text-green-400" 
                          : bid.status === "Outbid" 
                            ? "bg-red-900/30 text-red-400"
                            : "bg-blue-900/30 text-blue-400"
                      }`}>
                        {bid.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Budget Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Current spending and allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="text-sm">1,750 SOL / 2,500 SOL</span>
              </div>
              <Progress value={70} className="h-2 bg-gray-700" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-750 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Allocated</div>
                <div className="text-xl font-bold">1,750 SOL</div>
                <div className="text-xs text-gray-400 mt-1">70% of total</div>
              </div>
              <div className="bg-gray-750 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Spent</div>
                <div className="text-xl font-bold">576.8 SOL</div>
                <div className="text-xs text-gray-400 mt-1">33% of allocated</div>
              </div>
              <div className="bg-gray-750 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Remaining</div>
                <div className="text-xl font-bold">1,173.2 SOL</div>
                <div className="text-xs text-gray-400 mt-1">67% of allocated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Ad Management Tab */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ad-management">Ad Management</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {/* Overview content remains the same */}
        </TabsContent>
        <TabsContent value="ad-management">
          <AdvertiserDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
