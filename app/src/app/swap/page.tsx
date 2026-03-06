"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { ArrowDownUp, Brain, Info } from "lucide-react";

const SENTIMENT_DATA = {
  score: 35,
  label: "Fear 😨",
  fee: "0.15%",
  color: "text-orange-400",
  bgColor: "bg-orange-400/10",
  borderColor: "border-orange-400/30",
};

export default function SwapPage() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 2000);
  };

  const handleFromAmount = (val: string) => {
    setFromAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setToAmount((num * 0.985).toFixed(4));
    } else {
      setToAmount("");
    }
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-md mx-auto">

          {/* Sentiment Banner */}
          <div className={`mb-4 p-3 rounded-xl border ${SENTIMENT_DATA.bgColor} ${SENTIMENT_DATA.borderColor} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">
                Market Sentiment: <span className={`font-semibold ${SENTIMENT_DATA.color}`}>{SENTIMENT_DATA.label}</span>
              </span>
            </div>
            <div className={`text-sm font-bold ${SENTIMENT_DATA.color}`}>
              Fee: {SENTIMENT_DATA.fee}
            </div>
          </div>

          {/* Swap Card */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Swap</h2>
              <button className="text-gray-400 hover:text-white">
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* From Token */}
            <div className="bg-black/50 rounded-xl p-4 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">You pay</span>
                <span className="text-gray-400 text-sm">Balance: 0.00</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmount(e.target.value)}
                  className="bg-transparent text-2xl font-semibold flex-1 outline-none text-white placeholder-gray-600"
                />
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                  <span className="font-semibold">{fromToken}</span>
                </div>
              </div>
            </div>

            {/* Flip Button */}
            <div className="flex justify-center my-2">
              <button
                onClick={flipTokens}
                className="bg-gray-800 hover:bg-gray-700 border border-white/10 rounded-xl p-2 transition-all hover:scale-110">
                <ArrowDownUp className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* To Token */}
            <div className="bg-black/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">You receive</span>
                <span className="text-gray-400 text-sm">Balance: 0.00</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="bg-transparent text-2xl font-semibold flex-1 outline-none text-white placeholder-gray-600"
                />
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-cyan-500" />
                  <span className="font-semibold">{toToken}</span>
                </div>
              </div>
            </div>

            {/* Swap Details */}
            {fromAmount && (
              <div className="bg-black/30 rounded-xl p-3 mb-4 space-y-2">
                {[
                  { label: "Rate", value: `1 ${fromToken} = 0.985 ${toToken}` },
                  { label: "Fee (Sentiment-based)", value: SENTIMENT_DATA.fee, colored: true },
                  { label: "Price Impact", value: "< 0.01%" },
                  { label: "Min. Received", value: `${(parseFloat(toAmount) * 0.995).toFixed(4)} ${toToken}` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className={item.colored ? SENTIMENT_DATA.color : "text-white"}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={!fromAmount || isSwapping}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02]">
              {isSwapping ? "Swapping..." : !fromAmount ? "Enter Amount" : "Swap"}
            </button>
          </div>

          {/* Sentiment Score Card */}
          <div className="mt-4 bg-gray-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold">Fear & Greed Index</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-black/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                  style={{ width: `${SENTIMENT_DATA.score}%` }}
                />
              </div>
              <span className={`text-2xl font-bold ${SENTIMENT_DATA.color}`}>
                {SENTIMENT_DATA.score}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}