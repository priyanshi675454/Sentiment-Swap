"use client";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Brain } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">SentimentSwap</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/swap"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Swap
          </Link>
          <Link href="/pools"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Pools
          </Link>
          <Link href="/sentiment"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Sentiment
          </Link>
          <Link href="/stake"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Stake
          </Link>
        </div>

        {/* Wallet Button */}
        <WalletMultiButton
          style={{
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            borderRadius: "10px",
            fontSize: "14px",
            height: "40px",
          }}
        />
      </div>
    </nav>
  );
}