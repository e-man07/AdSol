"use client"

import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Newspaper, 
  ArrowUp, 
  ArrowDown,
  Eye,
  MousePointerClick,
  Clock,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function PublisherDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  
  // Mock data for the dashboard
  const stats = [
    { 
      title: "Total Revenue", 
      value: "1,245.32 SOL", 
      change: "+12.5%", 
      trend: "up", 
      icon: DollarSign 
    },
    { 
      title: "Active Ad Slots", 
      value: "24", 
      change: "+3", 
      trend: "up", 
      icon: Newspaper 
    },
    { 
      title: "Total Impressions", 
      value: "1.2M", 
      change: "+8.1%", 
      trend: "up", 
      icon: Eye 
    },
    { 
      title: "Avg. Click Rate", 
      value: "3.2%", 
      change: "-0.5%", 
      trend: "down", 
      icon: MousePointerClick 
    },
  ]
  
  const recentSlots = [
    { 
      id: "slot-001", 
      name: "Homepage Banner", 
      price: "0.5 SOL", 
      duration: "7 days", 
      status: "Active", 
      impressions: 12500, 
      clicks: 380,
      created: "2 days ago" 
    },
    { 
      id: "slot-002", 
      name: "Sidebar Premium", 
      price: "0.3 SOL", 
      duration: "14 days", 
      status: "Active", 
      impressions: 8200, 
      clicks: 245,
      created: "5 days ago" 
    },
    { 
      id: "slot-003", 
      name: "Article Footer", 
      price: "0.2 SOL", 
      duration: "30 days", 
      status: "Auction", 
      impressions: 5100, 
      clicks: 102,
      created: "1 week ago" 
    },
    { 
      id: "slot-004", 
      name: "Mobile Interstitial", 
      price: "0.4 SOL", 
      duration: "10 days", 
      status: "Pending", 
      impressions: 0, 
      clicks: 0,
      created: "Just now" 
    },
  ]
  
  const topPerformers = [
    { name: "Homepage Banner", revenue: 245.8, ctr: 3.04 },
    { name: "Sidebar Premium", revenue: 180.2, ctr: 2.99 },
    { name: "Article Footer", revenue: 120.5, ctr: 2.00 },
    { name: "Mobile Interstitial", revenue: 95.3, ctr: 3.52 },
    { name: "Video Pre-roll", revenue: 85.1, ctr: 4.21 },
  ]
  
  const recentPayments = [
    { id: "pmt-001", amount: "0.5 SOL", from: "Adv...x45j", date: "Today", status: "Completed" },
    { id: "pmt-002", amount: "1.2 SOL", from: "Adv...p92k", date: "Yesterday", status: "Completed" },
    { id: "pmt-003", amount: "0.8 SOL", from: "Adv...m73l", date: "3 days ago", status: "Completed" },
    { id: "pmt-004", amount: "0.3 SOL", from: "Adv...h12p", date: "1 week ago", status: "Completed" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Publisher Dashboard</h1>
          <p className="text-gray-400">Monitor your ad slots and earnings</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/publisher/ad-slots/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Ad Slot
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
        {/* Recent Ad Slots */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Ad Slots</CardTitle>
              <Link href="/dashboard/publisher/ad-slots">
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-400">
              Your recently created and active ad slots
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Impressions</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSlots.map((slot) => (
                    <tr key={slot.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-4">
                        <div className="font-medium">{slot.name}</div>
                        <div className="text-sm text-gray-400">{slot.id}</div>
                      </td>
                      <td className="p-4">{slot.price}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          slot.status === "Active" 
                            ? "bg-green-900/30 text-green-400" 
                            : slot.status === "Auction" 
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-yellow-900/30 text-yellow-400"
                        }`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="p-4">{slot.impressions.toLocaleString()}</td>
                      <td className="p-4 text-gray-400">{slot.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Overview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Top performing ad slots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {topPerformers.map((performer, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{performer.name}</span>
                  <span className="text-sm text-gray-400">{performer.revenue} SOL</span>
                </div>
                <Progress value={performer.ctr * 20} className="h-2 bg-gray-700" />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>CTR: {performer.ctr}%</span>
                  <span>Revenue: {performer.revenue} SOL</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Payments */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Link href="/dashboard/publisher/earnings">
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                View All
              </Button>
            </Link>
          </div>
          <CardDescription className="text-gray-400">
            Recent payments received from advertisers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left p-4 text-gray-400 font-medium">From</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4 font-mono text-sm">{payment.id}</td>
                    <td className="p-4 font-medium">{payment.amount}</td>
                    <td className="p-4 font-mono text-sm">{payment.from}</td>
                    <td className="p-4 text-gray-400">{payment.date}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
