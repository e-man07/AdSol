"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Coins,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

export default function LandingPage() {
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-gray-700/20 to-gray-900/20 blur-xl"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-gray-900 border border-gray-700 text-sm font-medium text-white mb-2">
                Powered by Solana Blockchain
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="block">Revolutionize</span>
                <span className="text-white">On-Chain Advertising</span>
              </h1>
              <p className="text-lg md:text-xl text-purple-100/90 max-w-lg">
                The first decentralized marketplace connecting advertisers and
                publishers with transparent metrics, instant payments, and zero
                middlemen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/dashboard">
                  <Button className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-6 rounded-xl text-lg shadow-lg shadow-white/10 hover:shadow-white/20 transition-all">
                    Launch App
                    <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white font-medium px-8 py-6 rounded-xl text-lg"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-xs font-bold text-black"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-purple-200">
                  <span className="font-bold">1,200+</span> users already
                  onboarded
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gray-900 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 shadow-xl">
                <div className="aspect-[4/3] relative rounded-xl overflow-hidden border-2 border-gray-700">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="AdSol Platform Preview"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        Marketplace Dashboard
                      </h3>
                      <p className="text-sm text-purple-100/80">
                        Connect, create campaigns, and track performance in
                        real-time
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-white rounded-lg p-3 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <TrendingUp className="h-6 w-6 text-black" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gray-800 rounded-lg p-3 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Coins className="h-6 w-6 text-white" />
                </motion.div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-[100px] opacity-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-500 rounded-full blur-[100px] opacity-10"></div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-16 md:py-24 relative z-10 bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              {
                value: "$12M+",
                label: "Ad Volume",
                icon: BarChart3,
                color: "from-green-400 to-cyan-400",
              },
              {
                value: "0.5s",
                label: "Settlement Time",
                icon: Zap,
                color: "from-yellow-400 to-orange-400",
              },
              {
                value: "10,000+",
                label: "Publishers",
                icon: Users,
                color: "from-purple-400 to-pink-400",
              },
              {
                value: "100%",
                label: "Transparency",
                icon: Shield,
                color: "from-blue-400 to-indigo-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all hover:shadow-lg hover:shadow-white/5"
              >
                <div className="p-3 rounded-lg bg-white mb-4">
                  <stat.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-purple-200/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-20 md:py-32 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="text-white">Why Choose AdSol?</span>
              </h2>
              <p className="text-lg text-purple-100/80">
                Our platform combines the power of Solana blockchain with
                cutting-edge ad tech to create a revolutionary advertising
                ecosystem.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Instant Settlements",
                description:
                  "Payments flow directly between advertisers and publishers in real-time with Solana's lightning-fast transactions.",
                icon: Zap,
                color: "from-green-400 to-cyan-500",
                delay: 0,
              },
              {
                title: "Transparent Metrics",
                description:
                  "All ad performance data is stored on-chain, providing immutable proof of impressions, clicks, and conversions.",
                icon: BarChart3,
                color: "from-purple-400 to-pink-500",
                delay: 0.1,
              },
              {
                title: "Zero Middlemen",
                description:
                  "Connect directly with publishers or advertisers, eliminating intermediaries and reducing costs by up to 70%.",
                icon: Users,
                color: "from-yellow-400 to-orange-500",
                delay: 0.2,
              },
              {
                title: "Fraud Prevention",
                description:
                  "Our blockchain-based verification system eliminates bot traffic and ensures authentic human engagement.",
                icon: Shield,
                color: "from-blue-400 to-indigo-500",
                delay: 0.3,
              },
              {
                title: "Smart Targeting",
                description:
                  "Leverage on-chain data for precise audience targeting while preserving user privacy and consent.",
                icon: TrendingUp,
                color: "from-red-400 to-pink-500",
                delay: 0.4,
              },
              {
                title: "Token Rewards",
                description:
                  "Earn AdSol tokens for participation, which can be staked for platform governance and additional benefits.",
                icon: Coins,
                color: "from-purple-400 to-blue-500",
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="relative group"
              >
                <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/20 backdrop-blur-sm h-full hover:shadow-xl hover:shadow-white/5 transition-all duration-300 hover:-translate-y-2">
                  <div className="p-3 rounded-lg bg-white mb-6 inline-block">
                    <feature.icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-purple-100/80">{feature.description}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-white/10 w-16 h-16 -top-8 -right-8 group-hover:bg-white/20 transition-all duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 md:py-32 relative z-10 bg-black"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-white">How AdSol Works</span>
            </h2>
            <p className="text-lg text-purple-100/80">
              Our platform makes on-chain advertising simple, transparent, and
              effective for both advertisers and publishers.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-1/2 hidden md:block"></div>

            {[
              {
                title: "Connect Wallet",
                description:
                  "Link your Solana wallet to access the platform as an advertiser or publisher.",
                image: "/placeholder.svg?height=300&width=400",
                align: "left",
              },
              {
                title: "Create Campaign or List Space",
                description:
                  "Advertisers can create targeted campaigns while publishers can list their available ad spaces.",
                image: "/placeholder.svg?height=300&width=400",
                align: "right",
              },
              {
                title: "Smart Contract Match",
                description:
                  "Our protocol automatically matches advertisers with relevant publishers based on criteria and bids.",
                image: "/placeholder.svg?height=300&width=400",
                align: "left",
              },
              {
                title: "Real-time Performance",
                description:
                  "Track impressions, clicks, and conversions in real-time with all data stored transparently on-chain.",
                image: "/placeholder.svg?height=300&width=400",
                align: "right",
              },
            ].map((step, index) => (
              <div key={index} className="mb-16 last:mb-0">
                <div
                  className={`flex flex-col ${
                    step.align === "right"
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                  } items-center gap-8`}
                >
                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{
                      opacity: 0,
                      x: step.align === "right" ? 20 : -20,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gray-800/20 blur-xl transform -rotate-6"></div>
                      <div className="relative rounded-xl overflow-hidden border-2 border-gray-700">
                        <Image
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          width={400}
                          height={300}
                          className="w-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{
                      opacity: 0,
                      x: step.align === "right" ? -20 : 20,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      {/* Step number */}
                      <div className="absolute top-0 left-1/2 md:left-auto md:top-1/2 transform -translate-y-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-lg z-10 text-black">
                        {index + 1}
                      </div>

                      <div className="pt-12 md:pt-0 md:pl-8 md:pr-8">
                        <h3 className="text-2xl font-bold mb-4">
                          {step.title}
                        </h3>
                        <p className="text-purple-100/80">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gray-900/50 border border-gray-700/20 backdrop-blur-md p-8 md:p-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gray-500 rounded-full blur-[100px] opacity-10"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Revolutionize Your Advertising?
              </h2>
              <p className="text-lg text-purple-100/80 mb-8 max-w-2xl mx-auto">
                Join the future of on-chain advertising today. Connect your
                wallet, create your first campaign, and experience the power of
                decentralized advertising.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-6 rounded-xl text-lg shadow-lg shadow-white/10 hover:shadow-white/20 transition-all">
                    Launch App
                    <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white font-medium px-8 py-6 rounded-xl text-lg"
                >
                  Join Discord
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">AdSol</span>
              </div>
              <p className="text-purple-100/80 max-w-md mb-6">
                The first decentralized marketplace connecting advertisers and
                publishers with transparent metrics, instant payments, and zero
                middlemen.
              </p>
              <div className="flex gap-4">
                {["twitter", "discord", "github", "telegram"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/80 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "How It Works",
                  "Pricing",
                  "Marketplace",
                  "Roadmap",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-purple-100/80 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                {[
                  "Documentation",
                  "API",
                  "Analytics",
                  "Support",
                  "Community",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-purple-100/80 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-purple-100/60">
              © {new Date().getFullYear()} AdSol. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-sm text-purple-100/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-purple-100/60 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-purple-100/60 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
