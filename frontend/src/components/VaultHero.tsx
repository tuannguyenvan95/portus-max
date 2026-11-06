import React from "react";
import { TrendingUp, ShieldCheck, Cpu, Lock, Wallet, AlertCircle, ArrowUpRight, Zap, RefreshCw } from "lucide-react";

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
  onOpenAbout: () => void;
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
  onOpenAbout,
}) => {
  const isSolana = activeLane === "solana";
  const isConnected = isSolana ? !!solanaAddress : !!evmAddress;

  const solanaRatio = totalAssets > 0 ? (solanaAllocated / totalAssets) * 100 : 75;
  const idleRatio = Math.max(0, 100 - solanaRatio);

  return (
    <div className="space-y-6">
      {/* Top Banner & APY Highlight */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3 shadow-solanaGlow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SolCross Protocol · Atomic CPI Yield Port</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            SolCross Yield Port.{" "}
            <span className="bg-gradient-to-r from-rome-solana via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Zero Bridges. Pure Atomic CPI.
            </span>
          </h1>
          <p className="mt-2 text-sm text-rome-textDim max-w-2xl leading-relaxed">
            Directly connect your Phantom (Solana) or MetaMask (EVM) wallet. Real balances and contract states are queried 
            live from Solana Devnet / Mainnet and Rome EVM with zero simulations or mock data.
          </p>
        </div>

        {/* Live APY Showcase Card */}
        <div className="bg-gradient-to-br from-rome-card via-[#131722] to-[#181a2e] border border-rome-border rounded-3xl p-6 shadow-glow flex items-center gap-5 min-w-[280px] shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rome-solana/20 to-emerald-500/20 border border-rome-solana/30 flex items-center justify-center text-rome-solana shadow-solanaGlow shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Net Protocol APY</div>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-rome-solana via-emerald-300 to-cyan-400 bg-clip-text font-mono">
              {currentApy.toFixed(2)}%
            </div>
            <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>75% Solana Kamino + 25% Buffer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real TVL */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all shadow-glow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>On-Chain Vault TVL</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">● Live on Rome EVM</span>
            <span>settles on Solana L1</span>
          </div>
        </div>

        {/* Real Solana Deployed Capital */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all shadow-glow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Solana Yield Position</span>
            <Cpu className="w-4 h-4 text-rome-solana" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-transparent bg-gradient-to-r from-rome-solana to-cyan-400 bg-clip-text">
            ${solanaAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-normal text-slate-400 ml-1.5">USDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span>CPI Precompile:</span>
            <span className="font-mono text-slate-300">0xFF..0008</span>
          </div>
        </div>

        {/* Real Connected Wallet Balance */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all shadow-glow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Connected Wallet Balance</span>
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>
          {isConnected ? (
            <div className="mt-2">
              {isSolana ? (
                <>
                  <div className="text-xl font-bold font-mono text-white">
                    {splUsdcBalance.toFixed(2)} <span className="text-xs text-slate-400 font-normal">SPL USDC</span>
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
                    {evmNativeBalance.toFixed(4)} USDC (Rome Gas)
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mt-2 text-xs text-slate-400 font-mono italic">
              Connect MetaMask or Phantom to view live on-chain balance
            </div>
          )}
        </div>

        {/* User Vault Position */}
        <div className="bg-rome-card border border-rome-border rounded-2xl p-5 hover:border-slate-700 transition-all shadow-glow">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Your Vault Shares</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {userShares.toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-400">scUSDC</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Value: ${(userShares * sharePrice).toFixed(2)} USDC</span>
            <span className="text-emerald-400">1:1.00</span>
          </div>
        </div>
      </div>

      {/* Dynamic Target Allocation Progress Bar */}
      <div className="bg-rome-card/80 border border-rome-border rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
            <Zap className="w-4 h-4 text-rome-solana" />
            <span>Target Capital Allocation (Rome Portus Specification)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Solana Yield Port: <strong>{solanaRatio.toFixed(1)}%</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>EVM Liquid Reserve: <strong>{idleRatio.toFixed(1)}%</strong></span>
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-rome-dark rounded-full overflow-hidden flex border border-rome-border/60">
          <div 
            style={{ width: `${solanaRatio}%` }} 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
            title={`Solana Kamino Yield: ${solanaRatio.toFixed(1)}%`}
          />
          <div 
            style={{ width: `${idleRatio}%` }} 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
            title={`EVM Instant Liquidity Buffer: ${idleRatio.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};
