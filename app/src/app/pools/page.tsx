"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Plus, Minus, TrendingUp, Droplets } from "lucide-react";

const POOLS = [
  {
    id: 1,
    tokenA: "SOL",
    tokenB: "USDC",
    tvl: "$0",
    volume24h: "$0",
    fee: "0.15%",
    apy: "0%",
    colorA: "from-purple-500 to-cyan-500",
    colorB: "from-green-500 to-cyan-500",
  },
  {
    id: 2,
    tokenA: "SOL",
    tokenB: "BONK",
    tvl: "$0",
    volume24h: "$0",
    fee: "0.15%",
    apy: "0%",
    colorA: "from-purple-500 to-cyan-500",
    colorB: "from-yellow-500 to-orange-500",
  },
];

export default function PoolsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Liquidity Pools</h1>
            <p className="text-gray-400 mt-1">Provide liquidity and earn sentiment-adjusted fees</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-5 py-3 rounded-xl transition-all">
            <Plus className="w-4 h-4" />
            Add Liquidity
          </button>
        </div>

        {/* Add Liquidity Panel */}
        {showAdd && (
          <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4 text-purple-400">Add Liquidity</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-black/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-2">Token A Amount</div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="bg-transparent text-xl font-semibold flex-1 outline-none"
                  />
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                    <span className="font-semibold">SOL</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-2">Token B Amount</div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="bg-transparent text-xl font-semibold flex-1 outline-none"
                  />
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-cyan-500" />
                    <span className="font-semibold">USDC</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold py-3 rounded-xl">
              Add Liquidity
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "my"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "all" | "my")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}>
              {tab === "all" ? "All Pools" : "My Positions"}
            </button>
          ))}
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Droplets className="w-5 h-5 text-blue-400" />, label: "Total TVL", value: "$0" },
            { icon: <TrendingUp className="w-5 h-5 text-green-400" />, label: "24h Volume", value: "$0" },
            { icon: <TrendingUp className="w-5 h-5 text-purple-400" />, label: "Total Pools", value: "2" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Pools Table */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-white/10 text-gray-400 text-sm">
            <span className="col-span-2">Pool</span>
            <span>TVL</span>
            <span>24h Volume</span>
            <span>Fee</span>
            <span>Actions</span>
          </div>

          {POOLS.map((pool) => (
            <div key={pool.id}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-all items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${pool.colorA} border-2 border-gray-900`} />
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${pool.colorB} border-2 border-gray-900`} />
                </div>
                <span className="font-semibold">{pool.tokenA}/{pool.tokenB}</span>
              </div>
              <span className="text-white">{pool.tvl}</span>
              <span className="text-white">{pool.volume24h}</span>
              <span className="text-purple-400 font-semibold">{pool.fee}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-3 py-1 rounded-lg text-sm transition-all">
                  <Plus className="w-3 h-3" />
                  Add
                </button>
                <button className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-lg text-sm transition-all">
                  <Minus className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}