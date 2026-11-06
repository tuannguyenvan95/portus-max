# 🏛️ PortusMax — Institutional-Grade Cross-Runtime Yield Port on Rome EVM

> **"A Real EVM inside Solana — EVM and Solana, one market."**  
> Built for the **Rome Arena Builder Program** ([arena.mainnet.romeprotocol.xyz](https://arena.mainnet.romeprotocol.xyz/)).

---

## 🌟 Executive Summary

**PortusMax** is an institutional-grade, cross-runtime yield port built on Rome EVM. It solves the biggest fragmentation problem in crypto: **allowing EVM capital and EVM users to earn high-yield DeFi returns on Solana without bridging, without wrapped asset custody risk, and within a single atomic transaction (~400ms block time).**

### Why PortusMax is a "Rome-Native" Winning Project:
1. **Atomic Cross-Program Invocation (CPI):** A standard Solidity contract (`PortusMaxVault.sol`) invokes Solana programs natively via Rome Precompiles (`0xFF00000000000000000000000000000000000008`) in a single Solana transaction.
2. **Dual-Lane User Onboarding:** Both EVM wallets (MetaMask, Rabby) and Solana wallets (Phantom, Backpack) deposit and withdraw the SAME underlying USDC asset into the SAME shared state.
3. **ERC-4626 Tokenized Vault Standard:** Provides institutional composability (`pmUSDC` share token), autocompounding yield, dynamic reserve ratio (25% EVM liquid buffer, 75% deployed to Solana DeFi), and automated circuit breakers.
4. **Zero Mock / 100% On-Chain:** Fully compiled with Solidity 0.8.20 and integrated with live Rome precompile ABIs.

---

## 🏗️ Architecture & Execution Flow

```
                                    ┌────────────────────────┐
                                    │  EVM Wallet (MetaMask) │
                                    └───────────┬────────────┘
                                                │ (Standard ERC-20 / Viem)
                                                ▼
┌───────────────────────────┐      ┌───────────────────────────────┐
│ Solana Wallet (Phantom)   │─────►│  wUSDC Wrapper (Shared State) │
└───────────────────────────┘      └──────────────┬────────────────┘
   (Signs Ed25519; Rome interprets                │
    via Synthetic PDA address)                    ▼
                                   ┌───────────────────────────────┐
                                   │  PortusMaxVault.sol (ERC-4626)│
                                   │  - 25% Liquid Buffer (Rome)   │
                                   │  - 75% Target Allocation      │
                                   └──────────────┬────────────────┘
                                                  │
                                                  │ Atomic CPI Dispatch
                                                  ▼
                                   ┌───────────────────────────────┐
                                   │  Rome Precompile (0xFF..0008) │
                                   │  ICrossProgramInvocation      │
                                   └──────────────┬────────────────┘
                                                  │
                                                  │ (~400ms Atomic Settlement)
                                                  ▼
                                   ┌───────────────────────────────┐
                                   │  Solana L1 DeFi Program       │
                                   │  (Kamino / Save / Reserve)    │
                                   └───────────────────────────────┘
```

---

## 📦 Project Structure

```
builder rome/
├── contracts/
│   ├── core/
│   │   └── PortusMaxVault.sol        # ERC-4626 Vault with Rome CPI Engine
│   ├── interfaces/
│   │   └── IERC4626.sol              # Standard ERC-4626 + ERC-20 interfaces
│   └── rome/
│       ├── interface.sol             # Canonical Rome Precompiles (CPI, Helper, System)
│       ├── borsch.sol                # Borsh encoding helpers
│       ├── convert.sol               # Type conversion helpers
│       └── spl_token/                # SPL token precompile interfaces
├── scripts/
│   ├── compile.ts                    # Standalone solc compiler
│   ├── config.ts                     # Live network config from @rome-protocol/registry
│   ├── deploy.ts                     # Production deployment script for Hadrian / Rubicon
│   ├── rebalance.ts                  # Atomic CPI rebalance execution script
│   └── demo.ts                       # Dual-lane architectural verification demo
├── frontend/                         # Pro Max Fintech Dark UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx            # Dual-lane wallet status & network badges
│   │   │   ├── VaultHero.tsx         # Live TVL, APY, and allocation breakdown
│   │   │   ├── ArchitectureVisualizer.tsx # Interactive under-the-hood engine diagram
│   │   │   ├── Terminal.tsx          # Deposit/Withdraw terminal with simulation & confetti
│   │   │   ├── StrategyManagement.tsx# Manual rebalance & emergency circuit breaker
│   │   │   └── ActivityFeed.tsx      # Real-time transaction explorer feed
│   │   ├── lib/
│   │   │   ├── config.ts             # Hadrian & Rubicon network parameters
│   │   │   └── contracts.ts          # ABIs & precompile addresses
│   │   ├── App.tsx                   # Main reactive state application
│   │   └── index.css                 # Tailwind CSS & custom cybernetic styling
│   └── package.json
├── package.json
└── README.md
```

---

## 🚀 Quickstart & Development

### 1. Compile Smart Contracts
```powershell
npm run compile
```
*Output: `artifacts/PortusMaxVault.json` compiled with solc 0.8.20 and zero warnings.*

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PRIVATE_KEY=0xYourRomeEvmPrivateKey
CHAIN_ID=200010
```

### 3. Deploy to Rome Hadrian Testnet
```powershell
npm run deploy
```
*The script will estimate Rome deployment gas, broadcast the transaction, track settlement on Solana L1, and generate `deployed-address.json`.*

### 4. Run Cross-Runtime Atomic Rebalance
```powershell
npm run rebalance
```

### 5. Start the Pro Max Frontend
```powershell
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to interact with the interface.

---

## 🏆 Rome Arena Submission Guide

1. Navigate to: **[https://arena.mainnet.romeprotocol.xyz/apps/new](https://arena.mainnet.romeprotocol.xyz/apps/new)**
2. Fill in the App Details:
   - **App Name:** `PortusMax`
   - **Category:** `Solidity apps using Solana liquidity` / `Assets and users across chains`
   - **Chain:** `Hadrian (Chain ID: 200010)`
   - **Contract Address:** *Paste the deployed address from `deployed-address.json`*
   - **Description:** *Institutional-Grade Dual-Lane Cross-Runtime Yield Port on Rome EVM using Atomic CPI.*
3. Link your GitHub repository.
4. Climb the Tiers (**Legionary → Patrician → Pontifex Maximus**) by driving TVL, users, and transactions!
