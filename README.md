# ⚡ SolCross Yield Port — Institutional Cross-Runtime Yield Port on Rome EVM

> **"A Real EVM inside Solana — EVM and Solana, one market."**  
> Built for the **Rome Arena Builder Program** ([arena.mainnet.romeprotocol.xyz](https://arena.mainnet.romeprotocol.xyz/)).

- 🌐 **Live Web Application (Vercel):** [https://frontend-lyart-eight-10.vercel.app](https://frontend-lyart-eight-10.vercel.app)
- 🐙 **GitHub Repository:** [https://github.com/tuannguyenvan95/portus-max](https://github.com/tuannguyenvan95/portus-max)
- 📜 **Rome Arena App Registration:** [https://arena.mainnet.romeprotocol.xyz/apps/new](https://arena.mainnet.romeprotocol.xyz/apps/new)

---

## 🌟 100% On-Chain Synchronization (Zero Mock)

SolCross is fully integrated with live Solana and Rome EVM nodes:
1. **Live Solana Connection:**
   - Real native SOL balance queried via `@solana/web3.js` (`connection.getBalance(pubkey)`).
   - Real SPL USDC balance queried via `getParsedTokenAccountsByOwner(pubkey, { mint })`.
   - Toggle seamlessly between **Hadrian (Solana Devnet)** and **Rubicon (Solana Mainnet)**.
2. **Rome Precompiles Atomic CPI Engine:**
   - Precompile `0xFF00000000000000000000000000000000000008` (CPI Dispatcher).
   - Precompile `0xFF00000000000000000000000000000000000009` (Helper & External Authority PDA).
   - Standard ERC-4626 Tokenized Vault contract (`SolCrossVault.sol`).
3. **Dual-Lane User Flow:**
   - **Phantom / Solflare (Solana Lane):** Real Ed25519 signatures, automatically driving Rome EVM state via synthetic PDAs.
   - **MetaMask / Rabby (EVM Lane):** Direct EIP-1193 interaction with Rome EVM.

---

## 🏗️ Architecture

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
                                   │  SolCrossVault.sol (ERC-4626) │
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

## 🚀 Quickstart

```powershell
# Compile SolCrossVault
npm run compile

# Run dual-lane demo
npm run demo

# Start frontend
cd frontend
npm run dev
```
