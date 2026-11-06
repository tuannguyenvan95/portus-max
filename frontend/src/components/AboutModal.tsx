import React, { useState } from "react";
import { 
  X, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Copy, 
  Check, 
  Trophy, 
  Flame, 
  Code2, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FrontendConfig;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, config }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "contracts" | "arena">("overview");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-rome-card border border-rome-border rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rome-solana/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-rome-border/80 flex items-center justify-between bg-rome-dark/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-solanaGlow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  About SolCross Protocol
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Rome Arena 2026
                </span>
              </div>
              <p className="text-xs text-rome-textDim">
                Cross-Runtime Yield Port (Portus Pattern) · Native Atomic CPI into Solana DeFi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-rome-border/60 px-6 bg-rome-dark/20 text-xs font-bold overflow-x-auto">
          {[
            { id: "overview", label: "Protocol Overview", icon: BookOpen },
            { id: "architecture", label: "Portus Architecture", icon: Cpu },
            { id: "contracts", label: "Smart Contracts & Registry", icon: Code2 },
            { id: "arena", label: "Arena Alignment", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium tracking-wide transition-all whitespace-nowrap ${
                  isSelected
                    ? "border-rome-solana text-rome-solana font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-sm text-slate-300">
          {activeTab === "overview" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-5">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>The Fundamental Problem SolCross Solves</span>
                </h3>
                <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
                  Solana houses billions in high-velocity liquidity and premier yield protocols (Kamino, Save, Orca, Jupiter). 
                  Historically, an EVM smart contract or an EVM user could never touch Solana programs in a single atomic transaction. 
                  Traditional bridges introduce multi-minute latency, custodial bridge risk, and completely break composability.
                </p>
                <div className="mt-3 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>SolCross solves this via Rome Protocol: a real EVM executed inside Solana's runtime with atomic settlement.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-rome-dark/60 border border-rome-border space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-rome-solana" />
                    <span>~400ms Atomic Blocks</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Solidity bytecode dispatches Solana program calls that execute and settle in the exact same Solana slot.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rome-dark/60 border border-rome-border space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Zero Bridging Risk</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Users maintain self-custody on EVM or Solana. No lock-and-mint multisig or custodial relayers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rome-dark/60 border border-rome-border space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Dual-Lane Interop</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Phantom (Ed25519) and MetaMask (Secp256k1) interact seamlessly with the same ERC-4626 vault state.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rome-surface/40 border border-rome-border space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How SolCross Yield Is Generated
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When USDC is deposited, SolCross maintains a <strong>25% liquid reserve</strong> on Rome EVM for instant zero-slippage redemptions, 
                  while actively dispatching <strong>75% into Solana lending pools (Kamino / Save)</strong> via Rome's CPI Precompile (<code className="text-blue-400">0xFF..0008</code>). 
                  The net APY is compounded continuously into the tokenized vault share price (<code className="text-slate-300">scUSDC</code>).
                </p>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-rome-dark/80 border border-rome-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Core Technical Primitives
                  </span>
                  <span className="text-[11px] font-mono text-rome-solana">Rome Solidity SDK</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border space-y-1">
                    <div className="font-bold text-blue-400 font-mono">
                      1. ICrossProgramInvocation (0xFF00000000000000000000000000000000000008)
                    </div>
                    <div className="text-slate-400">
                      The atomic CPI precompile dispatcher. Allows Solidity to call any Solana program with raw instruction data (Borsh-encoded) and account metas.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border space-y-1">
                    <div className="font-bold text-purple-400 font-mono">
                      2. IHelperProgram (0xFF00000000000000000000000000000000000009)
                    </div>
                    <div className="text-slate-400">
                      Manages Lamports, SPL token transfers, and derives the external-authority PDA that signs for the contract when calling Solana programs.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border space-y-1">
                    <div className="font-bold text-emerald-400 font-mono">
                      3. ISystemProgram (0xFF00000000000000000000000000000000000007)
                    </div>
                    <div className="text-slate-400">
                      Handles PDA derivation, Base58 conversions, and account creation within the Solana runtime.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rome-dark/60 border border-rome-border">
                <h4 className="text-xs font-bold text-white mb-2">Atomic Execution In A Single Solana Transaction</h4>
                <div className="font-mono text-[11px] p-3 rounded-lg bg-black/60 border border-slate-800 text-slate-300 overflow-x-auto space-y-1">
                  <p className="text-slate-500">// 1. User signs EVM transaction on Rome chain</p>
                  <p>SolCrossVault.deposit(amount);</p>
                  <p className="text-slate-500">// 2. Vault invokes CPI precompile inside the same slot</p>
                  <p>CpiProgram.invoke_signed(KAMINO_PROGRAM_ID, accounts, depositIxData, salts);</p>
                  <p className="text-slate-500">// 3. Settles on Solana L1 (~400ms). If CPI fails, the entire EVM call reverts.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-rome-dark/60 border border-rome-border space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Verified On-Chain Contract Addresses ({config.chainName})
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="text-slate-400 text-[10px] uppercase">SolCross ERC-4626 Vault</div>
                      <div className="text-white truncate">{config.defaultVaultAddress}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(config.defaultVaultAddress, "vault")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      {copiedKey === "vault" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="text-slate-400 text-[10px] uppercase">Rome wUSDC ERC-20 Wrapper</div>
                      <div className="text-white truncate">{config.wusdcAddress}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(config.wusdcAddress, "wusdc")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      {copiedKey === "wusdc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="text-slate-400 text-[10px] uppercase">Solana Rome EVM Program ID</div>
                      <div className="text-rome-solana truncate">{config.programId}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(config.programId, "romeEvm")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      {copiedKey === "romeEvm" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-rome-card border border-rome-border flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="text-slate-400 text-[10px] uppercase">Solana USDC Mint (Devnet/Mainnet)</div>
                      <div className="text-slate-300 truncate">{config.usdcMint}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(config.usdcMint, "usdcMint")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      {copiedKey === "usdcMint" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/tuannguyenvan95/portus-max"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={`${config.explorerUrl}/address/${config.defaultVaultAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Rome Block Explorer</span>
                </a>

                <a
                  href="https://docs.rome.builders"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 text-xs font-semibold transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Rome Documentation</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === "arena" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Trophy className="w-5 h-5" />
                  <span>Official Rome Arena Alignment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SolCross directly implements the official <strong>Portus / Cross-Runtime Yield Port</strong> specification 
                  from the Rome Arena ideas catalogue (<a href="https://arena.mainnet.romeprotocol.xyz/ideas" target="_blank" rel="noreferrer" className="underline text-amber-400">arena.mainnet.romeprotocol.xyz/ideas</a>).
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Live On-Chain Settlement:</strong> Real contracts compiled with solc 0.8.20 and deployed to Rome Hadrian (200010) and Rubicon (7531).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Dual-Wallet Lane:</strong> Seamless interaction for both Phantom (Ed25519) and MetaMask (Secp256k1) users over the same on-chain state.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">No Mocking or Simulation:</strong> Live RPC calls sync real SOL, SPL USDC, and Rome EVM wUSDC balances with auto-reconnection.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-rome-border/80 bg-rome-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rome Protocol · Rubicon Mainnet & Hadrian Testnet</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
