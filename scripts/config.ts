import { getChain, getTokens } from "@rome-protocol/registry";
import type { Hex } from "viem";

export interface RomeConfig {
  chainId: number;
  name: string;
  proxyUrl: string;
  solanaRpc: string;
  solanaCluster: string;
  programId: string;
  wusdc: Hex;
  usdcMint: string;
  explorerUrl: string;
  gasToken: string;
}

export const DEFAULT_CHAIN_ID = 200010; // Rome Hadrian Testnet

export function loadConfig(overrides: { chainId?: number; proxyUrl?: string; solanaRpc?: string } = {}): RomeConfig {
  const chainId = overrides.chainId ?? (process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : DEFAULT_CHAIN_ID);
  const chain = getChain(chainId);
  if (!chain) {
    throw new Error(`Chain ${chainId} not found in @rome-protocol/registry`);
  }

  const tokens = getTokens(chainId) ?? [];
  const gas = tokens.find((t: any) => t.kind === "gas");
  const wusdc = tokens.find((t: any) => t.kind === "spl_wrapper" && t.mintId === gas?.mintId);

  if (!wusdc) {
    throw new Error(`No wUSDC wrapper found for chain ${chainId} in the registry`);
  }

  return {
    chainId,
    name: chain.name,
    proxyUrl: overrides.proxyUrl || chain.rpcUrl,
    solanaRpc: overrides.solanaRpc || chain.solana.rpc,
    solanaCluster: chain.solana.cluster,
    programId: chain.romeEvmProgramId,
    wusdc: wusdc.address as Hex,
    usdcMint: wusdc.mintId,
    explorerUrl: chain.explorerUrl,
    gasToken: gas?.symbol || "USDC",
  };
}
