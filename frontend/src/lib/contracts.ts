import { parseAbi } from "viem";

export const PORTUS_VAULT_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalAssets() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function idleAssets() view returns (uint256)",
  "function solanaAllocatedAssets() view returns (uint256)",
  "function currentApyBps() view returns (uint256)",
  "function targetSolanaAllocationBps() view returns (uint256)",
  "function totalYieldHarvested() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function convertToShares(uint256 assets) view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function deposit(uint256 assets) returns (uint256)",
  "function deposit(uint256 assets, address receiver) returns (uint256)",
  "function withdraw(uint256 assets) returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)",
  "function rebalance() external",
  "function emergencyRecall() external",
  "function paused() view returns (bool)",
]);

export const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export const HELPER_PRECOMPILE = "0xff00000000000000000000000000000000000009" as const;
export const CPI_PRECOMPILE = "0xff00000000000000000000000000000000000008" as const;
export const WITHDRAW_PRECOMPILE = "0x4200000000000000000000000000000000000016" as const;
