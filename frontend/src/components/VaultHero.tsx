import React from "react";
import { TrendingUp, ShieldCheck, Cpu, ArrowUpRight, Lock, DollarSign } from "lucide-react";

interface VaultHeroProps {
  totalAssets: number;
  idleAssets: number;
  solanaAllocated: number;
  currentApy: number;
  totalYield: number;
  sharePrice: number;
  userBalance: number;
  userShares: number;
}

export const VaultHero: React.FC<VaultHeroProps> = ({
  totalAssets,
  idleAssets,
  solanaAllocated,
  currentApy,
  totalYield,
  sharePrice,
  userBalance,
  userShares,
}) => {
  const solanaRatio = totalAssets > 0 ? (solanaAllocated / totalAssets) * 100 : 75;
  const idleRatio = 100 - solanaRatio;

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            Rome Arena Featured Project · Canonical Portus Pattern
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Solana Yield for EVM Capital.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-rome-solana bg-clip-text text-transparent">
              Zero Bridges.
            </span>
          </h1>
          <p className="mt-2 text-sm text-rome-textDim max-w-2xl leading-relaxed">
            Deposit USDC on Rome EVM or Solana. Capital is automatically deployed into Solana DeFi lending 
            protocols via single-transaction <strong>Atomic CPI (~400ms)</strong>. Zero bridging latency, zero wrapped asset risk.
          </p>
        </div>

        {/* Live APY Badge Card */}
        <div className="bg-gradient-to-br from-rome-card via-[#131722] to-[#1a1829] border border-rome-border rounded-2xl p-5 shadow-glow flex items-center gap-5 min-w-[240px]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rome-solana/20 to-purple-500/20 border border-rome-solana/30 flex items-center justify-center text-rome-solana">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Net Annualized APY</div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-rome-solana via-emerald-300 to-blue-400 bg-clip-text font-mono">
              {currentApy.toFixed(2)}%
            </div>
            <div className="text-[11px] text-rome-solana font-medium flex items-center gap-1 mt-0.5">
              <span>● Kamino / Save Yield</span>
              <span>+ EVM Buffer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TVL Card */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Value Locked (TVL)</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400">● 100% On-Chain</span>
            <span>settled on Solana L1</span>
          </div>
        </div>

        {/* Solana Deployed Capital */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Solana Yield Allocation</span>
            <Cpu className="w-4 h-4 text-rome-solana" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-transparent bg-gradient-to-r from-rome-solana to-blue-400 bg-clip-text">
            ${solanaAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span>Active CPI:</span>
            <span className="font-mono text-slate-300">Precompile 0xFF..08</span>
          </div>
        </div>

        {/* Share Price */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Share Price (pmUSDC)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${sharePrice.toFixed(4)}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
            <span>Appreciating via auto-harvesting</span>
          </div>
        </div>

        {/* User Deposited */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Your Position</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${(userShares * sharePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{userShares.toFixed(2)} pmUSDC</span>
            <span className="text-blue-400 font-medium">Wallet: ${userBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Cross-Runtime Allocation Bar */}
      <div className="bg-rome-card border border-rome-border rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rome-solana"></span>
            Solana DeFi Lending Program ({solanaRatio.toFixed(1)}%)
          </span>
          <span className="font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Rome EVM Liquid Reserve Buffer ({idleRatio.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${solanaRatio}%` }}
            className="h-full bg-gradient-to-r from-purple-500 via-rome-solana to-emerald-400 transition-all duration-500"
          ></div>
          <div
            style={{ width: `${idleRatio}%` }}
            className="h-full bg-blue-600 transition-all duration-500"
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Automatic atomic rebalance triggers when idle buffer deviates from 25% target</span>
          <span className="font-mono text-slate-400">Total Harvested: ${totalYield.toFixed(2)} USDC</span>
        </div>
      </div>
    </div>
  );
};
