import { 
  HADRIAN_REGISTRY, 
  HADRIAN_TOKENS, 
  RUBICON_REGISTRY, 
  RUBICON_TOKENS 
} from "./registryData";

export interface FrontendConfig {
  networkId: "hadrian" | "rubicon";
  chainId: number;
  chainName: string;
  rpcUrl: string;
  solanaRpc: string;
  solanaCluster: "devnet" | "mainnet-beta";
  programId: string;
  wusdcAddress: `0x${string}`;
  usdcMint: string;
  explorerUrl: string;
  defaultVaultAddress: `0x${string}`;
}

const hadrianWusdc = HADRIAN_TOKENS.find((t) => t.symbol === "wUSDC");

export const HADRIAN_CONFIG: FrontendConfig = {
  networkId: "hadrian",
  chainId: HADRIAN_REGISTRY.chainId,
  chainName: "Rome Hadrian (Testnet)",
  rpcUrl: HADRIAN_REGISTRY.rpcUrl,
  solanaRpc: HADRIAN_REGISTRY.solana?.rpc || "https://api.devnet.solana.com",
  solanaCluster: "devnet",
  programId: HADRIAN_REGISTRY.romeEvmProgramId,
  wusdcAddress: (hadrianWusdc?.address || "0xbce339ba4c3a8de3bb8af1c5539e6ac11da3112d") as `0x${string}`,
  usdcMint: hadrianWusdc?.mintId || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  explorerUrl: HADRIAN_REGISTRY.explorerUrl.replace(/\/$/, ""),
  defaultVaultAddress: "0x892aF014b292eC7C1Db184e125F4C7581B806Fe4",
};

const rubiconWusdc = RUBICON_TOKENS.find((t) => t.symbol === "wUSDC");

export const RUBICON_CONFIG: FrontendConfig = {
  networkId: "rubicon",
  chainId: RUBICON_REGISTRY.chainId,
  chainName: "Rome Rubicon (Mainnet)",
  rpcUrl: RUBICON_REGISTRY.rpcUrl,
  solanaRpc: RUBICON_REGISTRY.solana?.rpc || "https://api.mainnet-beta.solana.com",
  solanaCluster: "mainnet-beta",
  programId: RUBICON_REGISTRY.romeEvmProgramId,
  wusdcAddress: (rubiconWusdc?.address || "0x0952d2339Ff9B30282E2C01F758e5784C59F7C2F") as `0x${string}`,
  usdcMint: rubiconWusdc?.mintId || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  explorerUrl: RUBICON_REGISTRY.explorerUrl.replace(/\/$/, ""),
  defaultVaultAddress: "0x0000000000000000000000000000000000000000",
};

export function getConfigForNetwork(network: "hadrian" | "rubicon"): FrontendConfig {
  return network === "rubicon" ? RUBICON_CONFIG : HADRIAN_CONFIG;
}
