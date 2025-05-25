"use client";

import RoleSwitcher from "@/components/RoleSwitcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Eye,
  ImageIcon,
  Megaphone,
  MousePointerClick,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StatItem {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: any; // You might want to replace 'any' with the actual icon type
}

interface Campaign {
  id: string;
  name: string;
  budget: string;
  spent: string;
  status: "Active" | "Scheduled" | "Paused" | "Completed";
  impressions: number;
  clicks: number;
  ctr: string;
  startDate: string;
  endDate: string;
}

interface AdPerformance {
  name: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface RecentBid {
  id: string;
  slot: string;
  amount: string;
  date: string;
  status: "Won" | "Outbid" | "Active";
}

export default function AdvertiserDashboardPage() {
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize empty data states with proper types
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Total Spent",
      value: "0 SOL",
      change: "0%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Campaigns",
      value: "0",
      change: "0",
      trend: "up",
      icon: Megaphone,
    },
    {
      title: "Total Impressions",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Avg. Click Rate",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: MousePointerClick,
    },
  ]);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [adPerformance, setAdPerformance] = useState<AdPerformance[]>([]);
  const [recentBids, setRecentBids] = useState<RecentBid[]>([]);

  return (
    <div className="space-y-8 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Advertiser Dashboard
          </h1>
          <p className="text-white/60">
            Manage your campaigns and ad performance
          </p>
        </div>
        <div className="flex gap-2">
          <RoleSwitcher currentRole="advertiser" />
          <Link href="/dashboard/advertiser/campaigns/create">
            <Button className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10 hover:shadow-white/20 transition-all rounded-md">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
          <Link href="/dashboard/advertiser/ad-library/create">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white transition-all rounded-md"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              New Ad Creative
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">
                    {stat.title || "Loading..."}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-white">
                    {stat.value || "--"}
                  </h3>
                  {stat.change && (
                    <div className="flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === "up"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-white/10">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Active Campaigns */}
        <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Active Campaigns</CardTitle>
              <Link href="/dashboard/advertiser/campaigns">
                <Button
                  variant="link"
                  className="text-white hover:text-white/80 p-0"
                >
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription className="text-white/60">
              Your currently running ad campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-white/60 font-medium">
                      Campaign
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Budget
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Spent
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Impressions
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      CTR
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-b border-gray-800">
                      <td colSpan={6} className="p-4 text-center text-white/60">
                        Loading campaign data...
                      </td>
                    </tr>
                  ) : activeCampaigns.length === 0 ? (
                    <tr className="border-b border-gray-800">
                      <td colSpan={6} className="p-4 text-center text-white/60">
                        No active campaigns found
                      </td>
                    </tr>
                  ) : (
                    activeCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b border-gray-800 hover:bg-[#1a1f3d]/50"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-white">
                              {campaign.name}
                            </div>
                            <div className="text-sm text-white/60">
                              {campaign.startDate} - {campaign.endDate}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white">{campaign.budget}</td>
                        <td className="p-4 text-white">{campaign.spent}</td>
                        <td className="p-4 text-white">
                          {campaign.impressions.toLocaleString()}
                        </td>
                        <td className="p-4 text-white">{campaign.ctr}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === "Active"
                                ? "bg-green-900/30 text-green-400"
                                : "bg-blue-900/30 text-blue-400"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ad Performance */}
        <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Ad Performance</CardTitle>
            <CardDescription className="text-white/60">
              Performance metrics for your top ads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center text-white/60 py-4">
                Loading performance data...
              </div>
            ) : (
              adPerformance.map((ad, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {ad.name}
                    </span>
                    <span className="text-sm text-white/60">
                      {ad.impressions.toLocaleString()} impressions
                    </span>
                  </div>
                  <Progress
                    value={ad.ctr * 20}
                    className="h-2 bg-gray-800 rounded-full"
                  />
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>CTR: {ad.ctr}%</span>
                    <span>Clicks: {ad.clicks.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Recent Bids</CardTitle>
            <CardDescription className="text-white/60">
              Your recent bids on ad slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-white/60 font-medium">
                      ID
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Ad Slot
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Bid Amount
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Date
                    </th>
                    <th className="text-left p-4 text-white/60 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-b border-gray-800">
                      <td colSpan={5} className="p-4 text-center text-white/60">
                        Loading bid data...
                      </td>
                    </tr>
                  ) : (
                    recentBids.map((bid) => (
                      <tr
                        key={bid.id}
                        className="border-b border-gray-800 hover:bg-[#1a1f3d]/50"
                      >
                        <td className="p-4 font-mono text-sm text-white">
                          {bid.id}
                        </td>
                        <td className="p-4 font-medium text-white">
                          {bid.slot}
                        </td>
                        <td className="p-4 text-white">{bid.amount}</td>
                        <td className="p-4 text-white/60">{bid.date}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bid.status === "Won"
                                ? "bg-green-900/30 text-green-400"
                                : bid.status === "Outbid"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-blue-900/30 text-blue-400"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card className="bg-[#0f1123]/90 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Budget Overview</CardTitle>
          <CardDescription className="text-white/60">
            Current spending and allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-white/60 py-4">
                Loading budget data...
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      Total Budget
                    </span>
                    <span className="text-sm text-white">
                      1,750 SOL / 2,500 SOL
                    </span>
                  </div>
                  <Progress
                    value={70}
                    className="h-2 bg-gray-800 rounded-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#1a1f3d]/50 p-4 rounded-lg">
                    <div className="text-sm text-white/60">Allocated</div>
                    <div className="text-xl font-bold text-white">
                      1,750 SOL
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      70% of total
                    </div>
                  </div>
                  <div className="bg-[#1a1f3d]/50 p-4 rounded-lg">
                    <div className="text-sm text-white/60">Spent</div>
                    <div className="text-xl font-bold text-white">
                      576.8 SOL
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      33% of allocated
                    </div>
                  </div>
                  <div className="bg-[#1a1f3d]/50 p-4 rounded-lg">
                    <div className="text-sm text-white/60">Remaining</div>
                    <div className="text-xl font-bold text-white">
                      1,173.2 SOL
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      67% of allocated
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
