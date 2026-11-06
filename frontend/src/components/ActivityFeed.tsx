import React from "react";
import { ArrowUpRight, CheckCircle2, Cpu, ExternalLink, Clock } from "lucide-react";
import type { FrontendConfig } from "../lib/config";

export interface ActivityItem {
  id: string;
  type: "deposit" | "withdraw" | "rebalance" | "harvest";
  walletLane: "evm" | "solana";
  amount: number;
  txHash: string;
  timestamp: string;
  status: "settled";
}

interface ActivityFeedProps {
  config: FrontendConfig;
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ config, activities }) => {
  return (
    <div className="bg-rome-card border border-rome-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-rome-border/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Recent Cross-Runtime Activity</span>
          </h3>
          <p className="text-xs text-rome-textDim mt-0.5">
            Atomic transactions settled across Rome EVM & Solana L1
          </p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Feed
        </span>
      </div>

      <div className="divide-y divide-rome-border/40 overflow-hidden">
        {activities.map((act) => (
          <div
            key={act.id}
            className="py-3.5 flex items-center justify-between gap-4 hover:bg-rome-surface/30 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  act.type === "deposit"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : act.type === "withdraw"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {act.type === "rebalance" ? (
                  <Cpu className="w-4 h-4" />
                ) : act.type === "deposit" ? (
                  <ArrowUpRight className="w-4 h-4 rotate-45" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 -rotate-45" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white capitalize">
                    {act.type === "rebalance" ? "Atomic Solana CPI Rebalance" : act.type}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      act.walletLane === "evm"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {act.walletLane.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {act.timestamp}
                </div>
              </div>
            </div>

            <div className="text-right">
              {act.amount > 0 && (
                <div className="text-xs font-bold font-mono text-white">
                  {act.type === "deposit" ? "+" : act.type === "withdraw" ? "-" : ""}
                  ${act.amount.toFixed(2)} USDC
                </div>
              )}
              <a
                href={`${config.explorerUrl}/tx/${act.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
              >
                <span>{act.txHash.slice(0, 6)}...{act.txHash.slice(-4)}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
