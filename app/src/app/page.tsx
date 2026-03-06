"use client";
import Link from "next/link";
import { Brain, Zap, Shield, TrendingUp } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">
            World's First Sentiment-Driven AMM
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Swap Smarter.<br />Feel the Market.
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          SentimentSwap automatically adjusts swap fees based on real-time
          on-chain market sentiment. When markets fear — fees drop.
          When greed takes over — fees rise.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/swap"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105">
            Launch App →
          </Link>
          <Link href="/sentiment"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all">
            View Sentiment
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
          {[
            { label: "Total Volume", value: "$0" },
            { label: "Total Liquidity", value: "$0" },
            { label: "Current Fee", value: "0.30%" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why SentimentSwap?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Brain className="w-6 h-6 text-purple-400" />,
              title: "Sentiment-Driven Fees",
              desc: "Fees automatically adjust from 0.05% to 1% based on our on-chain Fear & Greed Index built from real Solana data.",
            },
            {
              icon: <Shield className="w-6 h-6 text-cyan-400" />,
              title: "LP Protection",
              desc: "During extreme greed, fees increase to protect liquidity providers from impermanent loss and mercenary capital.",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-green-400" />,
              title: "DeAura Integration",
              desc: "Stake DeAura tokens to get fee discounts and earn a share of protocol revenue.",
            },
          ].map((f) => (
            <div key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}