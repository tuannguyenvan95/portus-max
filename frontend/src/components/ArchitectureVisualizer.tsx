import React, { useState } from "react";
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, Info, ArrowLeftRight, Zap } from "lucide-react";

export const ArchitectureVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: "1. Dual-Lane Entry",
      subtitle: "EVM & Solana Wallets",
      badge: "Single State",
      color: "from-blue-500 to-indigo-500",
      description:
        "MetaMask signs an EVM transaction or Phantom signs a Solana v1 transaction. Both lanes interact with the exact same wUSDC token account and ERC-4626 vault state.",
      tech: "Viem + Rome LaneSigner / Synthetic Address (PDA)",
    },
    {
      id: 2,
      title: "2. SolCross Vault",
      subtitle: "Solidity Core on Rome EVM",
      badge: "ERC-4626 Standard",
      color: "from-indigo-500 to-purple-500",
      description:
        "Standardized tokenized vault tracks share price (scUSDC), maintains 25% instant liquid reserve on Rome, and routes 75% into Solana DeFi protocols via atomic CPI.",
      tech: "Solidity ^0.8.20 + solc optimizer (200 runs)",
    },
    {
      id: 3,
      title: "3. Rome Precompile CPI",
      subtitle: "Cross-Program Dispatcher",
      badge: "0xFF..0008 Dispatcher",
      color: "from-purple-500 to-pink-500",
      description:
        "Invokes Solana programs directly via Rome's Precompile dispatch table. Translates EVM bytecode calls to native Solana CPI instructions in the same runtime.",
      tech: "ICrossProgramInvocation.invoke_signed()",
    },
    {
      id: 4,
      title: "4. Solana L1 Settlement",
      subtitle: "Kamino / Save Lending Yield",
      badge: "~400ms Atomic",
      color: "from-pink-500 to-rome-solana",
      description:
        "Executes directly on Solana L1 state. If any sub-instruction fails, the entire EVM transaction reverts atomically. Zero bridging latency or custody risk.",
      tech: "Solana Devnet / Rubicon Mainnet L1 Settlement",
    },
  ];

  return (
    <div className="bg-rome-card border border-rome-border rounded-2xl p-6 space-y-6 shadow-glow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rome-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rome-solana" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Rome Atomic Execution Engine (Under The Hood)
            </h2>
          </div>
          <p className="text-xs text-rome-textDim mt-0.5">
            Click any step below to inspect how Rome executes Solidity and Solana programs in a single block
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-rome-dark border border-rome-border text-slate-300">
            CPI Precompile: <span className="text-blue-400 font-semibold">0xFF..0008</span>
          </span>
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {steps.map((step) => {
          const isSelected = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`cursor-pointer rounded-2xl p-4 transition-all border relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-rome-surface border-blue-500/80 shadow-glow"
                  : "bg-rome-dark/50 border-rome-border hover:border-slate-700 hover:bg-rome-surface/40"
              }`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} ${
                  isSelected ? "opacity-100" : "opacity-30"
                }`}
              ></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {step.id}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {step.badge}
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{step.title}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{step.subtitle}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-rome-border/40 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 text-[10px] truncate max-w-[130px]">
                  {step.tech}
                </span>
                <span className={`font-bold ${isSelected ? "text-blue-400" : "text-slate-500"}`}>
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card */}
      {(() => {
        const current = steps.find((s) => s.id === activeStep) || steps[0];
        return (
          <div className="p-4 rounded-xl bg-rome-dark/80 border border-rome-border flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-2">
                <span>{current.title} · Deep Dive</span>
                <span className="text-[10px] font-normal text-slate-400">({current.subtitle})</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Implementation: <span className="text-emerald-400">{current.tech}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
