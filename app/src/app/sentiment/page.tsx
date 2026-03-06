"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { Brain, TrendingUp, TrendingDown, Activity, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockHistory = [
  { time: "00:00", score: 45 },
  { time: "02:00", score: 38 },
  { time: "04:00", score: 32 },
  { time: "06:00", score: 28 },
  { time: "08:00", score: 35 },
  { time: "10:00", score: 42 },
  { time: "12:00", score: 38 },
  { time: "14:00", score: 35 },
  { time: "16:00", score: 30 },
  { time: "18:00", score: 35 },
  { time: "20:00", score: 38 },
  { time: "22:00", score: 35 },
];

const getSentimentInfo = (score: number) => {
  if (score <= 20) return { label: "Extreme Fear", color: "#ef4444", fee: "0.05%", emoji: "😱" };
  if (score <= 40) return { label: "Fear", color: "#f97316", fee: "0.15%", emoji: "😨" };
  if (score <= 60) return { label: "Neutral", color: "#eab308", fee: "0.30%", emoji: "😐" };
  if (score <= 80) return { label: "Greed", color: "#22c55e", fee: "0.50%", emoji: "🤑" };
  return { label: "Extreme Greed", color: "#a855f7", fee: "1.00%", emoji: "🚀" };
};

export default function SentimentPage() {
  const [score, setScore] = useState(35);
  const [animatedScore, setAnimatedScore] = useState(0);
  const info = getSentimentInfo(score);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev < score) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4 max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Live On-Chain Sentiment</span>
          </div>
          <h1 className="text-4xl font-bold">Fear & Greed Index</h1>
          <p className="text-gray-400 mt-2">Built from real Solana on-chain data</p>
        </div>

        {/* Main Score Card */}
        <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 mb-6 text-center">
          <div className="text-8xl mb-4">{info.emoji}</div>
          <div className="text-7xl font-black mb-2" style={{ color: info.color }}>
            {animatedScore}
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: info.color }}>
            {info.label}
          </div>
          <div className="text-gray-400 mb-6">Current swap fee: <span className="font-bold text-white">{info.fee}</span></div>

          {/* Score Bar */}
          <div className="relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-2">
            <div
              className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg transition-all duration-1000"
              style={{ left: `${score}%`, transform: "translateX(-50%)" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 — Extreme Fear</span>
            <span>50 — Neutral</span>
            <span>100 — Extreme Greed</span>
          </div>
        </div>

        {/* Fee Tiers */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { range: "0-20", label: "Extreme Fear", fee: "0.05%", color: "border-red-500/50 bg-red-500/10", active: score <= 20 },
            { range: "21-40", label: "Fear", fee: "0.15%", color: "border-orange-500/50 bg-orange-500/10", active: score > 20 && score <= 40 },
            { range: "41-60", label: "Neutral", fee: "0.30%", color: "border-yellow-500/50 bg-yellow-500/10", active: score > 40 && score <= 60 },
            { range: "61-80", label: "Greed", fee: "0.50%", color: "border-green-500/50 bg-green-500/10", active: score > 60 && score <= 80 },
            { range: "81-100", label: "Ext. Greed", fee: "1.00%", color: "border-purple-500/50 bg-purple-500/10", active: score > 80 },
          ].map((tier) => (
            <div key={tier.range}
              className={`border rounded-xl p-3 text-center transition-all ${tier.color} ${tier.active ? "scale-105 shadow-lg" : "opacity-60"}`}>
              <div className="text-xs text-gray-400 mb-1">{tier.range}</div>
              <div className="text-sm font-semibold mb-1">{tier.label}</div>
              <div className="text-lg font-black text-white">{tier.fee}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            24h Sentiment History
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockHistory}>
              <XAxis dataKey="time" stroke="#374151" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#374151" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#9ca3af" }}
                itemStyle={{ color: "#a855f7" }}
              />
              <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Component Scores */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Activity className="w-5 h-5 text-blue-400" />, label: "Volume Score", value: 25, desc: "24h DEX volume on Solana", color: "#60a5fa" },
            { icon: <TrendingDown className="w-5 h-5 text-orange-400" />, label: "Price Score", value: 20, desc: "SOL price change (24h)", color: "#f97316" },
            { icon: <Users className="w-5 h-5 text-green-400" />, label: "Wallet Activity", value: 30, desc: "Active wallets on-chain", color: "#22c55e" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <div className="text-3xl font-black mb-2" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${item.value}%`, background: item.color }} />
              </div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}