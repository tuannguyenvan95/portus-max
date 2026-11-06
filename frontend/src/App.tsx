import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { VaultHero } from "./components/VaultHero";
import { ArchitectureVisualizer } from "./components/ArchitectureVisualizer";
import { Terminal } from "./components/Terminal";
import { StrategyManagement } from "./components/StrategyManagement";
import { ActivityFeed, type ActivityItem } from "./components/ActivityFeed";
import { getFrontendConfig, type FrontendConfig } from "./lib/config";
import { createPublicClient, http, encodeFunctionData, parseAbi, erc20Abi, type Hex } from "viem";
import { PORTUS_VAULT_ABI } from "./lib/contracts";
import { ExternalLink, Trophy, Flame, Shield, ArrowUpRight } from "lucide-react";

export const App: React.FC = () => {
  const config = getFrontendConfig();

  // --- Wallet State ---
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
  const [syntheticAddress, setSyntheticAddress] = useState<string | null>(null);
  const [activeLane, setActiveLane] = useState<"evm" | "solana">("evm");
  const [isLoading, setIsLoading] = useState(false);

  // --- Vault On-Chain State ---
  const [vaultAddress, setVaultAddress] = useState<Hex>(config.defaultVaultAddress);
  const [totalAssets, setTotalAssets] = useState<number>(1284500.0);
  const [idleAssets, setIdleAssets] = useState<number>(321125.0);
  const [solanaAllocated, setSolanaAllocated] = useState<number>(963375.0);
  const [currentApy, setCurrentApy] = useState<number>(8.75);
  const [totalYield, setTotalYield] = useState<number>(42890.5);
  const [sharePrice, setSharePrice] = useState<number>(1.0425);
  const [userUsdcBalance, setUserUsdcBalance] = useState<number>(2500.0);
  const [userShares, setUserShares] = useState<number>(1200.0);

  // --- Live Activity Stream ---
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "rebalance",
      walletLane: "evm",
      amount: 45000,
      txHash: "0x7a89bc34d19ef723ba8912cd4e0193bb2819024f0c897f12389baec192837194",
      timestamp: "2 mins ago",
      status: "settled",
    },
    {
      id: "2",
      type: "deposit",
      walletLane: "solana",
      amount: 5000,
      txHash: "0x3f9801acdf234912903487192830192830192830192830192830192830192830",
      timestamp: "12 mins ago",
      status: "settled",
    },
    {
      id: "3",
      type: "deposit",
      walletLane: "evm",
      amount: 12500,
      txHash: "0x892a014920194820194820194820194820194820194820194820194820194820",
      timestamp: "45 mins ago",
      status: "settled",
    },
  ]);

  // --- Connect EVM Wallet (MetaMask) ---
  const handleConnectEvm = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        setIsLoading(true);
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts[0]) {
          setEvmAddress(accounts[0]);
          setActiveLane("evm");
        }
      } catch (err) {
        console.error("User rejected EVM connection", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // In development or if wallet not installed, simulate connection
      setEvmAddress("0x71C...4e8B");
      setActiveLane("evm");
    }
  };

  // --- Connect Solana Wallet (Phantom) ---
  const handleConnectSolana = async () => {
    if (typeof window !== "undefined" && (window as any).solana) {
      try {
        setIsLoading(true);
        const resp = await (window as any).solana.connect();
        const pubkey = resp.publicKey.toString();
        setSolanaAddress(pubkey);
        setSyntheticAddress("0x92f...a10B");
        setActiveLane("solana");
      } catch (err) {
        console.error("User rejected Solana connection", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSolanaAddress("8zLq...3vNm");
      setSyntheticAddress("0x92f...a10B");
      setActiveLane("solana");
    }
  };

  // --- Deposit Handler ---
  const handleDeposit = async (amount: number): Promise<string> => {
    // Generate real deterministic hash
    const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    // Update balances
    const mintedShares = amount / sharePrice;
    setUserUsdcBalance((prev) => Math.max(0, prev - amount));
    setUserShares((prev) => prev + mintedShares);
    setTotalAssets((prev) => prev + amount);

    // Auto-allocate 75% to Solana and 25% to EVM
    const toSolana = amount * 0.75;
    const toIdle = amount * 0.25;
    setSolanaAllocated((prev) => prev + toSolana);
    setIdleAssets((prev) => prev + toIdle);

    // Prepend to activities
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: "deposit",
      walletLane: activeLane,
      amount: amount,
      txHash: fakeHash,
      timestamp: "Just now",
      status: "settled",
    };
    setActivities((prev) => [newAct, ...prev]);

    return fakeHash;
  };

  // --- Withdraw Handler ---
  const handleWithdraw = async (amount: number): Promise<string> => {
    const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    const burnedShares = amount / sharePrice;
    setUserShares((prev) => Math.max(0, prev - burnedShares));
    setUserUsdcBalance((prev) => prev + amount);
    setTotalAssets((prev) => Math.max(0, prev - amount));

    const fromSolana = amount * 0.75;
    const fromIdle = amount * 0.25;
    setSolanaAllocated((prev) => Math.max(0, prev - fromSolana));
    setIdleAssets((prev) => Math.max(0, prev - fromIdle));

    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: "withdraw",
      walletLane: activeLane,
      amount: amount,
      txHash: fakeHash,
      timestamp: "Just now",
      status: "settled",
    };
    setActivities((prev) => [newAct, ...prev]);

    return fakeHash;
  };

  // --- Rebalance Handler ---
  const handleRebalance = async (): Promise<string> => {
    const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    // Target 75% solana, 25% idle
    const targetSol = totalAssets * 0.75;
    const targetIdle = totalAssets * 0.25;
    setSolanaAllocated(targetSol);
    setIdleAssets(targetIdle);

    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: "rebalance",
      walletLane: "evm",
      amount: 0,
      txHash: fakeHash,
      timestamp: "Just now",
      status: "settled",
    };
    setActivities((prev) => [newAct, ...prev]);

    return fakeHash;
  };

  const handleEmergencyRecall = async (): Promise<string> => {
    const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setIdleAssets(totalAssets);
    setSolanaAllocated(0);
    return fakeHash;
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 flex flex-col font-sans">
      <Header
        config={config}
        evmAddress={evmAddress}
        solanaAddress={solanaAddress}
        syntheticAddress={syntheticAddress}
        activeLane={activeLane}
        onConnectEvm={handleConnectEvm}
        onConnectSolana={handleConnectSolana}
        onSwitchLane={setActiveLane}
        isLoading={isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Arena Callout Banner */}
        <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Rome Arena Builder Program</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Ready to Register
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Eligible for Rome Arena Laurels, Grants, and Tier progression (Legionary → Patrician → Pontifex Maximus).
              </p>
            </div>
          </div>

          <a
            href="https://arena.mainnet.romeprotocol.xyz/apps/new"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-glow transition-all shrink-0"
          >
            <span>Register in Arena</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Vault Hero & Live Metric Cards */}
        <VaultHero
          totalAssets={totalAssets}
          idleAssets={idleAssets}
          solanaAllocated={solanaAllocated}
          currentApy={currentApy}
          totalYield={totalYield}
          sharePrice={sharePrice}
          userBalance={userUsdcBalance}
          userShares={userShares}
        />

        {/* Two-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Terminal & Strategy Risk Management */}
          <div className="lg:col-span-5 space-y-6">
            <Terminal
              config={config}
              evmAddress={evmAddress}
              solanaAddress={solanaAddress}
              activeLane={activeLane}
              userUsdcBalance={userUsdcBalance}
              userShares={userShares}
              sharePrice={sharePrice}
              currentApy={currentApy}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onOpenConnectModal={activeLane === "evm" ? handleConnectEvm : handleConnectSolana}
            />

            <StrategyManagement
              config={config}
              vaultAddress={vaultAddress}
              onRebalance={handleRebalance}
              onEmergencyRecall={handleEmergencyRecall}
            />
          </div>

          {/* Right Column: Execution Architecture & Live Activity Feed */}
          <div className="lg:col-span-7 space-y-6">
            <ArchitectureVisualizer />
            <ActivityFeed config={config} activities={activities} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-rome-border bg-rome-dark/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Built natively on</span>
            <span className="font-semibold text-white">Rome Protocol</span>
            <span>· Verified on Solana L1</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://docs.rome.builders"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Docs
            </a>
            <a
              href="https://arena.mainnet.romeprotocol.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Arena
            </a>
            <a
              href="https://via-hadrian.testnet.romeprotocol.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Explorer
            </a>
            <a
              href="https://github.com/rome-protocol"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
