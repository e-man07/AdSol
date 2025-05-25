"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import RoleSwitcher from "@/components/RoleSwitcher"
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Eye,
  MousePointerClick,
  Newspaper,
  Plus
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

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

export default function PublisherDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  
  // Define data structures for the dashboard
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

  // Fetch data from API or blockchain
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
    
    fetchDashboardData()
    
    // Optional: Set up polling for real-time updates
    // const interval = setInterval(fetchDashboardData, 10000)
    // return () => clearInterval(interval)
  }, [timeRange])

  return (
    <div className="space-y-8 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Publisher Dashboard</h1>
          <p className="text-white/60">Monitor your ad slots and earnings</p>
        </div>
        <div className="flex gap-2">
          <RoleSwitcher currentRole="publisher" />
          <Link href="/dashboard/publisher/ad-slots/create">
            <Button className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10 hover:shadow-white/20 transition-all rounded-md">
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
            <Card key={index} className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  stat.trend === "up" ? "text-green-400" : stat.trend === "down" ? "text-red-400" : "text-white/60"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : stat.trend === "down" ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : null}
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
        <Card className="lg:col-span-2 bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Ad Slots</CardTitle>
              <Link href="/dashboard/publisher/ad-slots">
                <Button variant="link" className="text-white hover:text-white/80 p-0">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription className="text-white/60">
              Your recently created and active ad slots
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-white/60 font-medium">Name</th>
                    <th className="text-left p-4 text-white/60 font-medium">Price</th>
                    <th className="text-left p-4 text-white/60 font-medium">Status</th>
                    <th className="text-left p-4 text-white/60 font-medium">Impressions</th>
                    <th className="text-left p-4 text-white/60 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-b border-gray-800">
                      <td colSpan={5} className="p-4 text-center text-white/60">Loading ad slots...</td>
                    </tr>
                  ) : recentSlots.length > 0 ? (
                    recentSlots.map((slot) => (
                      <tr key={slot.id} className="border-b border-gray-800 hover:bg-[#1a1f3d]/50">
                        <td className="p-4">
                          <div className="font-medium text-white">{slot.name}</div>
                          <div className="text-sm text-white/60">{slot.id}</div>
                        </td>
                        <td className="p-4 text-white">{slot.price}</td>
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
                        <td className="p-4 text-white">{slot.impressions?.toLocaleString() || "0"}</td>
                        <td className="p-4 text-white/60">{slot.created}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-800">
                      <td colSpan={5} className="p-4 text-center text-white/60">No ad slots found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Overview */}
        <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Performance Overview</CardTitle>
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
            <Link href="/dashboard/publisher/earnings">
              <Button variant="link" className="text-white hover:text-white/80 p-0">
                View All
              </Button>
            </Link>
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
    </div>
  )
}
