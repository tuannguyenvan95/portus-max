import React, { useState } from "react";
import { Cpu, RefreshCw, AlertTriangle, ShieldCheck, Check, ExternalLink } from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface StrategyManagementProps {
  config: FrontendConfig;
  vaultAddress: string;
  onRebalance: () => Promise<string>;
  onEmergencyRecall: () => Promise<string>;
}

export const StrategyManagement: React.FC<StrategyManagementProps> = ({
  config,
  vaultAddress,
  onRebalance,
  onEmergencyRecall,
}) => {
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceTx, setRebalanceTx] = useState<string | null>(null);

  const handleRebalance = async () => {
    try {
      setIsRebalancing(true);
      const hash = await onRebalance();
      setRebalanceTx(hash);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebalancing(false);
    }
  };

  return (
    <div className="bg-rome-card border border-rome-border rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rome-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              On-Chain Strategy & Risk Management
            </h2>
          </div>
          <p className="text-xs text-rome-textDim mt-0.5">
            Cross-Runtime Precompiles · Automated Risk Guardrails · Circuit Breaker
          </p>
        </div>

        <button
          onClick={handleRebalance}
          disabled={isRebalancing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? "animate-spin" : ""}`} />
          <span>{isRebalancing ? "Settling via CPI..." : "Trigger Atomic Rebalance"}</span>
        </button>
      </div>

      {rebalanceTx && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Rebalance settled atomically on Solana L1!</span>
          </div>
          <a
            href={
              rebalanceTx.startsWith("0x")
                ? `${config.explorerUrl}/tx/${rebalanceTx}`
                : `https://explorer.solana.com/tx/${rebalanceTx}?cluster=${config.solanaCluster}`
            }
            target="_blank"
            rel="noreferrer"
            className="font-mono underline flex items-center gap-1 hover:text-white"
          >
            <span>View Receipt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Precompile Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rome-dark/60 border border-rome-border rounded-xl p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CPI Precompile Binding
          </div>
          <div className="text-xs font-mono text-blue-400 truncate">
            0xFF00000000000000000000000000000000000008
          </div>
          <div className="text-[11px] text-slate-400">
            Dispatches Solana program instructions natively from Solidity bytecode.
          </div>
        </div>

        <div className="bg-rome-dark/60 border border-rome-border rounded-xl p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Helper Precompile (SPL / PDA)
          </div>
          <div className="text-xs font-mono text-purple-400 truncate">
            0xFF00000000000000000000000000000000000009
          </div>
          <div className="text-[11px] text-slate-400">
            Derives External Authority PDAs, manages SPL token accounts, and delegates.
          </div>
        </div>

        <div className="bg-rome-dark/60 border border-rome-border rounded-xl p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Circuit Breaker Status
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Active Guardrails Normal
          </div>
          <div className="text-[11px] text-slate-400">
            Immediate emergency unwind recalls all Solana assets in a single transaction.
          </div>
        </div>
      </div>
    </div>
  );
};
