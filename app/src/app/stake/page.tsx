"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Zap, Gift, TrendingUp, Lock } from "lucide-react";

const TIERS = [
  { name: "Bronze", min: 100, discount: "10%", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  { name: "Silver", min: 1000, discount: "25%", color: "text-gray-300", bg: "bg-gray-300/10", border: "border-gray-300/30" },
  { name: "Gold", min: 5000, discount: "50%", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  { name: "Diamond", min: 10000, discount: "75%", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
];

export default function StakePage() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [staked, setStaked] = useState(0);

  const currentTier = TIERS.filter(t => staked >= t.min).pop();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">DeAura Token Staking</span>
          </div>
          <h1 className="text-4xl font-bold">Stake DeAura</h1>
          <p className="text-gray-400 mt-2">Stake DeAura tokens to unlock fee discounts and earn rewards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Lock className="w-5 h-5 text-purple-400" />, label: "Your Staked", value: `${staked} DEAURA` },
            { icon: <Gift className="w-5 h-5 text-cyan-400" />, label: "Fee Discount", value: currentTier ? currentTier.discount : "0%" },
            { icon: <TrendingUp className="w-5 h-5 text-green-400" />, label: "Current Tier", value: currentTier ? currentTier.name : "None" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-white/10 rounded-2xl p-5 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Stake Card */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Stake DeAura Tokens</h3>
          <div className="bg-black/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Amount to stake</span>
              <span className="text-gray-400 text-sm">Balance: 0 DEAURA</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold flex-1 outline-none placeholder-gray-600"
              />
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/30 rounded-xl px-3 py-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                <span className="font-semibold text-purple-300">DEAURA</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (stakeAmount) {
                setStaked(prev => prev + parseFloat(stakeAmount));
                setStakeAmount("");
              }
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 rounded-xl transition-all">
            Stake DeAura
          </button>
        </div>

        {/* Tier Cards */}
        <h3 className="font-semibold mb-4">Staking Tiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIERS.map((tier) => (
            <div key={tier.name}
              className={`border rounded-2xl p-5 text-center transition-all ${tier.bg} ${tier.border} ${staked >= tier.min ? "scale-105 shadow-lg" : "opacity-60"}`}>
              <div className={`text-2xl font-black mb-1 ${tier.color}`}>{tier.name}</div>
              <div className="text-gray-400 text-xs mb-3">Min: {tier.min.toLocaleString()} DEAURA</div>
              <div className={`text-3xl font-black ${tier.color}`}>{tier.discount}</div>
              <div className="text-gray-400 text-xs mt-1">fee discount</div>
              {staked >= tier.min && (
                <div className={`mt-3 text-xs font-semibold ${tier.color} bg-black/30 rounded-full px-2 py-1`}>
                  ✓ Unlocked
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}