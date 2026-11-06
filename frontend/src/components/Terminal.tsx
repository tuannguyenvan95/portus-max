import React, { useState } from "react";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Check, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  HelpCircle,
  Calculator,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import type { FrontendConfig } from "../lib/config";

interface TerminalProps {
  config: FrontendConfig;
  evmAddress: string | null;
  solanaAddress: string | null;
  activeLane: "evm" | "solana";
  spendableBalance: number;
  userShares: number;
  sharePrice: number;
  currentApy: number;
  onDeposit: (amount: number) => Promise<string>;
  onWithdraw: (amount: number) => Promise<string>;
  onOpenConnectModal: () => void;
  onOpenFaucet: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  config,
  evmAddress,
  solanaAddress,
  activeLane,
  spendableBalance,
  userShares,
  sharePrice,
  currentApy,
  onDeposit,
  onWithdraw,
  onOpenConnectModal,
  onOpenFaucet,
}) => {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const isConnected = activeLane === "evm" ? !!evmAddress : !!solanaAddress;
  const maxAvailable = mode === "deposit" ? spendableBalance : userShares * sharePrice;

  const estimatedShares = sharePrice > 0 ? numAmount / sharePrice : numAmount;
  const projectedYearlyYield = (numAmount * currentApy) / 100;
  const projectedMonthlyYield = projectedYearlyYield / 12;
  const projectedDailyYield = projectedYearlyYield / 365;

  const handlePercentage = (pct: number) => {
    const val = (maxAvailable * pct) / 100;
    setAmount(val > 0 ? val.toFixed(2) : "0");
  };

  const handleExecute = async () => {
    if (!isConnected) {
      onOpenConnectModal();
      return;
    }

    if (numAmount <= 0) return;

    try {
      setStatus("submitting");
      setErrorMessage(null);

      let txHash = "";
      if (mode === "deposit") {
        txHash = await onDeposit(numAmount);
      } else {
        txHash = await onWithdraw(numAmount);
      }

      setLastTxHash(txHash);
      setStatus("success");

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#14F195", "#3B82F6", "#9945FF", "#F59E0B"],
        });
      } catch (e) {
        // ignore
      }

      setAmount("");
    } catch (err: any) {
      console.error("Execution error:", err);
      setErrorMessage(err.message || "On-chain transaction rejected or failed");
      setStatus("error");
    }
  };

  return (
    <div className="bg-rome-card border border-rome-border rounded-3xl p-6 shadow-glow relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rome-solana/10 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        {/* Header & Mode Switcher */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 p-1 bg-rome-dark border border-rome-border rounded-xl">
            <button
              onClick={() => {
                setMode("deposit");
                setStatus("idle");
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "deposit"
                  ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-solanaGlow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Deposit
            </button>
            <button
              onClick={() => {
                setMode("withdraw");
                setStatus("idle");
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "withdraw"
                  ? "bg-purple-600 text-white shadow-solanaGlow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Withdraw
            </button>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400">
              {mode === "deposit" ? "Spendable Wallet Balance:" : "Redeemable Shares:"}
            </div>
            <div className="text-xs font-bold font-mono text-white">
              {maxAvailable.toFixed(2)} USDC
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-rome-dark/80 border border-rome-border rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{mode === "deposit" ? "Enter Deposit Amount" : "Enter Withdrawal Amount"}</span>
            <span className="font-mono text-slate-300">
              Lane: {activeLane === "evm" ? "MetaMask (EVM)" : "Phantom (Solana)"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setStatus("idle");
              }}
              className="bg-transparent text-2xl sm:text-4xl font-bold font-mono text-white outline-none w-full"
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rome-card border border-rome-border text-xs font-bold text-white shrink-0 shadow-sm">
              <span className="text-rome-solana">●</span>
              <span>USDC</span>
            </div>
          </div>

          {/* Preset Percentage Pills */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-rome-border/40">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentage(pct)}
                className="py-1.5 px-2 rounded-lg bg-rome-card hover:bg-slate-800 text-[11px] font-mono font-semibold text-slate-300 border border-rome-border/60 hover:text-white transition-colors"
              >
                {pct === 100 ? "MAX" : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Live Return Projection Breakdown */}
        <div className="mt-4 p-4 rounded-2xl bg-rome-surface/60 border border-rome-border text-xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Expected Shares ({mode === "deposit" ? "minted" : "burned"}):</span>
            <span className="font-mono font-bold text-white">
              {estimatedShares.toFixed(4)} scUSDC
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Projected Annual Yield ({currentApy.toFixed(2)}% APY):</span>
            <span className="font-mono font-bold text-emerald-400">
              +${projectedYearlyYield.toFixed(2)} USDC / yr
            </span>
          </div>

          {numAmount > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-rome-border/40 text-[11px]">
              <div className="text-slate-400">
                Daily: <span className="font-mono text-slate-200 font-semibold">+${projectedDailyYield.toFixed(4)}</span>
              </div>
              <div className="text-right text-slate-400">
                Monthly: <span className="font-mono text-slate-200 font-semibold">+${projectedMonthlyYield.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-rome-border/40">
            <span>Execution Runtime:</span>
            <span className="font-mono text-rome-solana font-semibold">
              {config.chainName} · Solana L1 Atomic CPI
            </span>
          </div>
        </div>

        {/* Balance Notice / Faucet Help */}
        {isConnected && spendableBalance === 0 && mode === "deposit" && (
          <div className="mt-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <span>Current on-chain USDC balance is 0.00. </span>
                {activeLane === "solana" ? (
                  <span>Fund your Phantom wallet with Devnet SOL & USDC to test.</span>
                ) : (
                  <span>Fund your MetaMask wallet with Rome Hadrian testnet USDC.</span>
                )}
              </div>
            </div>
            <button
              onClick={onOpenFaucet}
              className="text-xs font-bold underline text-cyan-400 hover:text-cyan-300 shrink-0"
            >
              Get Tokens
            </button>
          </div>
        )}
      </div>

      {/* Action Button & Status Feedback */}
      <div className="mt-5 space-y-3">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && lastTxHash && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>On-Chain Transaction Confirmed!</span>
            </div>
            <a
              href={`${config.explorerUrl}/tx/${lastTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono underline flex items-center gap-1 hover:text-white"
            >
              <span>View Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={status === "submitting" || (isConnected && numAmount <= 0)}
          className={`w-full py-4 px-4 rounded-2xl text-sm font-bold tracking-wide transition-all shadow-glow flex items-center justify-center gap-2 ${
            !isConnected
              ? "bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white hover:opacity-90"
              : numAmount <= 0
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              : status === "submitting"
              ? "bg-blue-700 text-white cursor-wait"
              : mode === "deposit"
              ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:opacity-90 shadow-solanaGlow"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
          }`}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Broadcasting to Rome EVM & Solana L1...</span>
            </>
          ) : !isConnected ? (
            <span>Connect Wallet to {mode === "deposit" ? "Deposit" : "Withdraw"}</span>
          ) : mode === "deposit" ? (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Deposit & Deploy to Solana Yield (Atomic CPI)</span>
            </>
          ) : (
            <span>Withdraw to On-Chain Wallet</span>
          )}
        </button>
      </div>
    </div>
  );
};
