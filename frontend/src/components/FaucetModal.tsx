import React, { useState } from "react";
import { X, ExternalLink, Droplets, Copy, Check, Info, AlertCircle } from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FrontendConfig;
  solanaAddress: string | null;
  evmAddress: string | null;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  config,
  solanaAddress,
  evmAddress,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-rome-card border border-rome-border rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-rome-border/80 flex items-center justify-between bg-rome-dark/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-glow">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Testnet Faucet & Funding Guide
              </h2>
              <p className="text-xs text-rome-textDim">
                Fund your Solana Devnet or Rome Hadrian EVM wallet with test tokens
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

        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[65vh] overflow-y-auto">
          {/* Solana Lane Faucets */}
          <div className="p-4 rounded-2xl bg-rome-dark/70 border border-rome-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <span className="text-rome-solana font-bold">◎</span>
                <span>Solana Lane (Phantom / Devnet)</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Solana Devnet
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              To test the Solana lane, you need testnet SOL for transaction fees and Circle Devnet USDC.
            </p>

            <div className="space-y-2">
              <a
                href="https://faucet.solana.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-rome-card hover:bg-slate-800 border border-rome-border transition-colors text-white font-semibold"
              >
                <span>1. Official Solana Devnet Faucet (SOL)</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://faucet.circle.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-rome-card hover:bg-slate-800 border border-rome-border transition-colors text-white font-semibold"
              >
                <span>2. Circle Faucet (Devnet USDC)</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {solanaAddress && (
              <div className="pt-1 flex items-center justify-between text-slate-400 bg-black/40 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                <span className="truncate mr-2">Your Address: {solanaAddress}</span>
                <button
                  onClick={() => copyToClipboard(solanaAddress, "solAddr")}
                  className="p-1 hover:text-white shrink-0"
                >
                  {copiedKey === "solAddr" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* EVM Lane Faucets */}
          <div className="p-4 rounded-2xl bg-rome-dark/70 border border-rome-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>EVM Lane (MetaMask / Hadrian)</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Rome Hadrian
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Rome Hadrian uses <strong>USDC</strong> as the native gas token (18 decimals) and <strong>wUSDC</strong> (6 decimals) for ERC-20 assets.
            </p>

            <div className="space-y-2">
              <a
                href="https://hadrian.testnet.romeprotocol.xyz/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-rome-card hover:bg-slate-800 border border-rome-border transition-colors text-white font-semibold"
              >
                <span>Rome Hadrian RPC & Faucet Portal</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://discord.gg/romeprotocol"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-rome-card hover:bg-slate-800 border border-rome-border transition-colors text-white font-semibold"
              >
                <span>Rome Discord #testnet-faucet</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {evmAddress && (
              <div className="pt-1 flex items-center justify-between text-slate-400 bg-black/40 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                <span className="truncate mr-2">Your EVM Address: {evmAddress}</span>
                <button
                  onClick={() => copyToClipboard(evmAddress, "evmAddr")}
                  className="p-1 hover:text-white shrink-0"
                >
                  {copiedKey === "evmAddr" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-rome-border/80 bg-rome-dark/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
