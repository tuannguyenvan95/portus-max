import React from "react";
import { Shield, Zap, ExternalLink, Wallet, CheckCircle2, RefreshCw } from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface HeaderProps {
  config: FrontendConfig;
  evmAddress: string | null;
  solanaAddress: string | null;
  syntheticAddress: string | null;
  activeLane: "evm" | "solana";
  onConnectEvm: () => void;
  onConnectSolana: () => void;
  onSwitchLane: (lane: "evm" | "solana") => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  evmAddress,
  solanaAddress,
  syntheticAddress,
  activeLane,
  onConnectEvm,
  onConnectSolana,
  onSwitchLane,
  isLoading,
}) => {
  return (
    <header className="border-b border-rome-border bg-rome-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-glow p-0.5">
            <div className="w-full h-full bg-rome-dark rounded-[10px] flex items-center justify-center font-bold text-xl text-white font-mono">
              🏛️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                PORTUS<span className="text-blue-500 font-extrabold">MAX</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Rome Arena v1.0
              </span>
            </div>
            <p className="text-xs text-rome-textDim hidden sm:block">
              Institutional Cross-Runtime Yield Port & Atomic CPI Vault
            </p>
          </div>
        </div>

        {/* Network & Chain Badges */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rome-card border border-rome-border text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-400">Rome Chain:</span>
            <span className="font-semibold text-white">{config.chainName} ({config.chainId})</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rome-card border border-rome-border text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-rome-solana" />
            <span className="font-medium text-slate-400">Settlement:</span>
            <span className="font-semibold text-rome-solana">Solana L1 Devnet (~400ms)</span>
          </div>
        </div>

        {/* Dual-Lane Wallet Controllers */}
        <div className="flex items-center gap-2">
          {/* EVM Lane Pill */}
          <button
            onClick={onConnectEvm}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
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
              <span>MetaMask (EVM)</span>
            )}
          </button>

          {/* Solana Lane Pill */}
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
            <span className="text-rome-solana">◎</span>
            {solanaAddress ? (
              <span className="font-mono">
                {solanaAddress.slice(0, 4)}...{solanaAddress.slice(-4)}
              </span>
            ) : (
              <span>Phantom (Solana)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
