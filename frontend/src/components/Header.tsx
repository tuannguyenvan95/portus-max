import React from "react";
import { Zap, RefreshCw, Globe, CheckCircle2 } from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface HeaderProps {
  config: FrontendConfig;
  selectedNetwork: "hadrian" | "rubicon";
  onSelectNetwork: (net: "hadrian" | "rubicon") => void;
  evmAddress: string | null;
  solanaAddress: string | null;
  syntheticAddress: string | null;
  activeLane: "evm" | "solana";
  onConnectEvm: () => void;
  onConnectSolana: () => void;
  onRefreshOnChain: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  selectedNetwork,
  onSelectNetwork,
  evmAddress,
  solanaAddress,
  syntheticAddress,
  activeLane,
  onConnectEvm,
  onConnectSolana,
  onRefreshOnChain,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-rome-border bg-rome-dark/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-blue-600 to-purple-600 shadow-glow p-0.5">
            <div className="w-full h-full bg-rome-dark rounded-[10px] flex items-center justify-center font-bold text-xl text-white">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SOL<span className="text-rome-solana font-extrabold">CROSS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rome-solana/10 text-rome-solana border border-rome-solana/30">
                100% On-Chain
              </span>
            </div>
            <p className="text-xs text-rome-textDim hidden sm:block">
              Rome Protocol Yield Port · Atomic CPI
            </p>
          </div>
        </div>

        {/* Center: Network Cluster Switcher */}
        <div className="hidden lg:flex items-center gap-2 bg-rome-card border border-rome-border p-1 rounded-xl">
          <button
            onClick={() => onSelectNetwork("hadrian")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedNetwork === "hadrian"
                ? "bg-blue-600 text-white shadow-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Hadrian (Solana Devnet)
          </button>
          <button
            onClick={() => onSelectNetwork("rubicon")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedNetwork === "rubicon"
                ? "bg-purple-600 text-white shadow-solanaGlow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3 h-3 text-rome-solana" />
            Rubicon (Solana Mainnet)
          </button>
        </div>

        {/* Right: Wallet Connectors & Refresh Action */}
        <div className="flex items-center gap-2">
          {/* Refresh On-Chain Data Button */}
          <button
            onClick={onRefreshOnChain}
            title="Refresh Real On-Chain Balances"
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-rome-card border border-rome-border text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* EVM MetaMask Pill */}
          <button
            onClick={onConnectEvm}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              evmAddress
                ? activeLane === "evm"
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-glow"
                  : "bg-rome-card text-slate-300 border-rome-border hover:border-slate-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-glow"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            {evmAddress ? (
              <span className="font-mono">
                {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
              </span>
            ) : (
              <span>MetaMask</span>
            )}
          </button>

          {/* Solana Phantom Pill */}
          <button
            onClick={onConnectSolana}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              solanaAddress
                ? activeLane === "solana"
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-solanaGlow"
                  : "bg-rome-card text-slate-300 border-rome-border hover:border-slate-600"
                : "bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:opacity-90 shadow-solanaGlow"
            }`}
          >
            <span className="text-rome-solana font-bold">◎</span>
            {solanaAddress ? (
              <span className="font-mono">
                {solanaAddress.slice(0, 4)}...{solanaAddress.slice(-4)}
              </span>
            ) : (
              <span>Phantom</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
