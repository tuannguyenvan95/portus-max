import React from "react";
import { TrendingUp, ShieldCheck, Cpu, Lock, Wallet, AlertCircle } from "lucide-react";

interface VaultHeroProps {
  totalAssets: number;
  idleAssets: number;
  solanaAllocated: number;
  currentApy: number;
  sharePrice: number;
  activeLane: "evm" | "solana";
  solanaAddress: string | null;
  evmAddress: string | null;
  solBalance: number;
  splUsdcBalance: number;
  evmNativeBalance: number;
  evmWusdcBalance: number;
  userShares: number;
}

export const VaultHero: React.FC<VaultHeroProps> = ({
  totalAssets,
  idleAssets,
  solanaAllocated,
  currentApy,
  sharePrice,
  activeLane,
  solanaAddress,
  evmAddress,
  solBalance,
  splUsdcBalance,
  evmNativeBalance,
  evmWusdcBalance,
  userShares,
}) => {
  const isSolana = activeLane === "solana";
  const isConnected = isSolana ? !!solanaAddress : !!evmAddress;

  const solanaRatio = totalAssets > 0 ? (solanaAllocated / totalAssets) * 100 : 75;
  const idleRatio = 100 - solanaRatio;

  return (
    <div className="space-y-6">
      {/* Title & Tagline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SolCross Protocol · 100% Real Synchronized On-Chain State
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            SolCross Yield Port.{" "}
            <span className="bg-gradient-to-r from-rome-solana via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Zero Bridges. Pure Atomic CPI.
            </span>
          </h1>
          <p className="mt-2 text-sm text-rome-textDim max-w-2xl leading-relaxed">
            Directly connect your Phantom (Solana) or MetaMask (EVM) wallet. Real balances are queried live 
            from Solana and Rome EVM nodes with zero simulation.
          </p>
        </div>

        {/* Live APY Card */}
        <div className="bg-gradient-to-br from-rome-card via-[#131722] to-[#1a1829] border border-rome-border rounded-2xl p-5 shadow-glow flex items-center gap-5 min-w-[240px]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rome-solana/20 to-purple-500/20 border border-rome-solana/30 flex items-center justify-center text-rome-solana">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Net Protocol APY</div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-rome-solana via-emerald-300 to-blue-400 bg-clip-text font-mono">
              {currentApy.toFixed(2)}%
            </div>
            <div className="text-[11px] text-rome-solana font-medium flex items-center gap-1 mt-0.5">
              <span>● Solana Kamino Yield</span>
              <span>+ Rome Buffer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real TVL */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>On-Chain Vault TVL</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400">● Live on Rome EVM</span>
            <span>settles on Solana L1</span>
          </div>
        </div>

        {/* Real Solana Deployed Capital */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Solana Yield Position</span>
            <Cpu className="w-4 h-4 text-rome-solana" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-transparent bg-gradient-to-r from-rome-solana to-blue-400 bg-clip-text">
            ${solanaAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span>CPI Precompile:</span>
            <span className="font-mono text-slate-300">0xFF..0008</span>
          </div>
        </div>

        {/* Real Wallet Balance Live */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Connected Wallet Balance</span>
            <Wallet className="w-4 h-4 text-rome-solana" />
          </div>
          {isConnected ? (
            <div className="mt-2">
              {isSolana ? (
                <>
                  <div className="text-xl font-bold font-mono text-white">
                    {splUsdcBalance.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USDC</span>
                  </div>
                  <div className="text-xs font-mono text-rome-solana mt-1">
                    {solBalance.toFixed(4)} SOL (Native Gas)
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold font-mono text-white">
                    {evmWusdcBalance.toFixed(2)} <span className="text-xs text-slate-400 font-normal">wUSDC</span>
                  </div>
                  <div className="text-xs font-mono text-blue-400 mt-1">
                    {evmNativeBalance.toFixed(4)} USDC (Gas)
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-400 font-mono italic">
              Connect wallet to view live on-chain balance
            </div>
          )}
        </div>

        {/* User Vault Position */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Your Vault Shares</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {(userShares * sharePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{userShares.toFixed(2)} scUSDC</span>
            <span className="text-purple-400 font-mono">Price: ${sharePrice.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
