import React, { useState } from "react";
import { ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, Info, ArrowLeftRight } from "lucide-react";

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
        "MetaMask signs EVM transaction or Phantom signs Solana v1 transaction. Both lanes interact with the exact same wUSDC wrapper and ERC-4626 vault state.",
      tech: "Viem + Rome LaneSigner / Synthetic Address (PDA)",
    },
    {
      id: 2,
      title: "2. PortusMax Vault",
      subtitle: "Solidity Core on Rome EVM",
      badge: "ERC-4626 Standard",
      color: "from-indigo-500 to-purple-500",
      description:
        "Standardized tokenized vault tracks share price (pmUSDC), manages 25% liquid buffer, and dynamically routes excess capital into Solana DeFi protocols.",
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
    <div className="bg-rome-card border border-rome-border rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rome-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rome-solana" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Rome Atomic Execution Engine (Under The Hood)
            </h2>
          </div>
          <p className="text-xs text-rome-textDim mt-0.5">
            Click any step to inspect how Rome executes Solidity and Solana programs in a single block
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
              className={`cursor-pointer rounded-xl p-4 transition-all border relative overflow-hidden flex flex-col justify-between ${
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
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-rome-textDim font-medium mt-0.5">{step.subtitle}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-rome-border/40 text-[11px] font-mono text-slate-400">
                {step.tech}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Details */}
      <div className="bg-rome-dark/70 border border-rome-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              {steps[activeStep - 1].title}: {steps[activeStep - 1].subtitle}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {steps[activeStep - 1].description}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Atomic Execution (~400ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
