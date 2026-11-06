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

export const HADRIAN_CONFIG: FrontendConfig = {
  networkId: "hadrian",
  chainId: 200010,
  chainName: "Rome Hadrian (Testnet)",
  rpcUrl: "https://hadrian.testnet.romeprotocol.xyz/",
  solanaRpc: "https://api.devnet.solana.com",
  solanaCluster: "devnet",
  programId: "RPTWwELXAY4KC9ZPHhaxp7Sq1hHtU3HNEgLbSegCcWf",
  wusdcAddress: "0xbce339ba4c3a8de3bb8af1c5539e6ac11da3112d",
  usdcMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Circle Devnet USDC
  explorerUrl: "https://via-hadrian.testnet.romeprotocol.xyz",
  defaultVaultAddress: "0x892aF014b292eC7C1Db184e125F4C7581B806Fe4",
};

export const RUBICON_CONFIG: FrontendConfig = {
  networkId: "rubicon",
  chainId: 7531,
  chainName: "Rome Rubicon (Mainnet)",
  rpcUrl: "https://rubicon.mainnet.romeprotocol.xyz/",
  solanaRpc: "https://api.mainnet-beta.solana.com",
  solanaCluster: "mainnet-beta",
  programId: "RomePq9X3iAoTr813HR7uRarafFDUJty6GdiEceYpzX",
  wusdcAddress: "0x0952d2339Ff9B30282E2C01F758e5784C59F7C2F",
  usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Circle Mainnet USDC
  explorerUrl: "https://via.mainnet.romeprotocol.xyz",
  defaultVaultAddress: "0x0000000000000000000000000000000000000000",
};

export function getConfigForNetwork(network: "hadrian" | "rubicon"): FrontendConfig {
  return network === "rubicon" ? RUBICON_CONFIG : HADRIAN_CONFIG;
}
