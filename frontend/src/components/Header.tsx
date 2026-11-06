import React, { useState, useRef, useEffect } from "react";
import { 
  Zap, 
  RefreshCw, 
  ChevronDown, 
  LogOut, 
  ExternalLink, 
  Check, 
  Info, 
  Droplets, 
  Copy, 
  HelpCircle,
  BookOpen,
  Rocket
} from "lucide-react";
import type { FrontendConfig } from "../lib/config";

interface HeaderProps {
  config: FrontendConfig;
  selectedNetwork: "hadrian" | "rubicon";
  onSelectNetwork: (net: "hadrian" | "rubicon") => void;
  evmAddress: string | null;
  solanaAddress: string | null;
  syntheticAddress: string | null;
  activeLane: "evm" | "solana";
  onSwitchLane: (lane: "evm" | "solana") => void;
  onConnectEvm: () => void;
  onDisconnectEvm: () => void;
  onConnectSolana: () => void;
  onDisconnectSolana: () => void;
  onRefreshOnChain: () => void;
  isRefreshing: boolean;
  onOpenAbout: () => void;
  onOpenFaucet: () => void;
  onOpenDeploy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  selectedNetwork,
  onSelectNetwork,
  evmAddress,
  solanaAddress,
  syntheticAddress,
  activeLane,
  onSwitchLane,
  onConnectEvm,
  onDisconnectEvm,
  onConnectSolana,
  onDisconnectSolana,
  onRefreshOnChain,
  isRefreshing,
  onOpenAbout,
  onOpenFaucet,
  onOpenDeploy,
}) => {
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNetworkDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedBadge(id);
    setTimeout(() => setCopiedBadge(null), 2000);
  };

  return (
    <header className="border-b border-rome-border bg-rome-dark/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-blue-600 to-purple-600 shadow-glow p-0.5 shrink-0">
            <div className="w-full h-full bg-rome-dark rounded-[14px] flex items-center justify-center font-bold text-xl text-white">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SOL<span className="text-rome-solana font-extrabold">CROSS</span>
              </span>
            </div>
            <p className="text-xs text-rome-textDim hidden sm:block">
              Rome Protocol Yield Port · Atomic CPI Engine
            </p>
          </div>
        </div>

        {/* Center: Network Selector, Settlement Badge & Info Links */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Network Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rome-card border border-rome-border text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-rome-surface transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{config.chainName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {networkDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-rome-card border border-rome-border shadow-2xl p-2 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Rome Execution Chain
                </div>
                <button
                  onClick={() => {
                    onSelectNetwork("hadrian");
                    setNetworkDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    selectedNetwork === "hadrian"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:bg-rome-surface"
                  }`}
                >
                  <div>
                    <div className="font-bold">Rome Hadrian (Testnet)</div>
                    <div className="text-[10px] text-slate-400">Chain ID: 200010 · Solana Devnet</div>
                  </div>
                  {selectedNetwork === "hadrian" && <Check className="w-4 h-4 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    onSelectNetwork("rubicon");
                    setNetworkDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    selectedNetwork === "rubicon"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-rome-surface"
                  }`}
                >
                  <div>
                    <div className="font-bold">Rome Rubicon (Mainnet)</div>
                    <div className="text-[10px] text-slate-400">Chain ID: 7531 · Solana Mainnet</div>
                  </div>
                  {selectedNetwork === "rubicon" && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Settlement Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rome-card border border-rome-border text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-rome-solana" />
            <span className="text-slate-400">Settlement:</span>
            <span className="font-semibold text-rome-solana capitalize">
              Solana {config.solanaCluster} (~400ms)
            </span>
          </div>

          {/* Deploy Personal Vault Button */}
          <button
            onClick={onOpenDeploy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-semibold text-emerald-300 hover:text-white transition-all shadow-solanaGlow"
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deploy Vault</span>
          </button>

          {/* About / Project Info Button */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 text-xs font-semibold text-blue-300 hover:text-white transition-all shadow-glow"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Protocol Docs</span>
          </button>

          {/* Faucet / Devnet Guide Button */}
          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rome-card border border-rome-border hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Faucet</span>
          </button>
        </div>

        {/* Right: Wallet Connectors & Disconnect Actions */}
        <div className="flex items-center gap-2">
          {/* Refresh On-Chain Data Button */}
          <button
            onClick={onRefreshOnChain}
            title="Refresh Real On-Chain Balances"
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-rome-card border border-rome-border text-slate-300 hover:text-white hover:border-slate-600 transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* Quick info trigger on mobile */}
          <button
            onClick={onOpenAbout}
            title="About SolCross Project"
            className="lg:hidden p-2.5 rounded-xl bg-rome-card border border-rome-border text-blue-400 hover:text-white transition-all shrink-0"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* EVM (MetaMask / Injected) Connector & Disconnect */}
          {evmAddress ? (
            <div
              className={`flex items-center rounded-xl overflow-hidden transition-all ${
                activeLane === "evm"
                  ? "bg-rome-card border-2 border-blue-500 shadow-glow"
                  : "bg-rome-card border border-rome-border opacity-75 hover:opacity-100"
              }`}
            >
              <button
                onClick={() => onSwitchLane("evm")}
                title="Active Lane: EVM (MetaMask). Click to select."
                className="px-3 py-2 text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>{evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}</span>
              </button>
              <button
                onClick={(e) => handleCopy(evmAddress, "evm", e)}
                title="Copy EVM Address"
                className="p-2 text-slate-400 hover:text-slate-200 border-l border-rome-border transition-colors"
              >
                {copiedBadge === "evm" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onDisconnectEvm}
                title="Disconnect EVM Wallet"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-l border-rome-border transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectEvm}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-glow transition-all"
            >
              Connect MetaMask
            </button>
          )}

          {/* Solana (Phantom) Connector & Disconnect */}
          {solanaAddress ? (
            <div
              className={`flex items-center rounded-xl overflow-hidden transition-all ${
                activeLane === "solana"
                  ? "bg-rome-card border-2 border-purple-500 shadow-solanaGlow"
                  : "bg-rome-card border border-rome-border opacity-75 hover:opacity-100"
              }`}
            >
              <button
                onClick={() => onSwitchLane("solana")}
                title="Active Lane: Solana (Phantom). Click to select."
                className="px-3 py-2 text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5 hover:bg-purple-500/10 transition-colors"
              >
                <span className="text-rome-solana font-bold">◎</span>
                <span>{solanaAddress.slice(0, 4)}...{solanaAddress.slice(-4)}</span>
              </button>
              <button
                onClick={(e) => handleCopy(solanaAddress, "sol", e)}
                title="Copy Solana Address"
                className="p-2 text-slate-400 hover:text-slate-200 border-l border-rome-border transition-colors"
              >
                {copiedBadge === "sol" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onDisconnectSolana}
                title="Disconnect Solana Wallet"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-l border-rome-border transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectSolana}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:opacity-90 shadow-solanaGlow transition-all"
            >
              Connect Phantom
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
