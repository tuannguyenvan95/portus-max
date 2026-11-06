import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createWalletClient, createPublicClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { loadConfig, type RomeConfig } from "./config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

export function romeChain(cfg: RomeConfig) {
  return {
    id: cfg.chainId,
    name: cfg.name,
    nativeCurrency: { name: cfg.gasToken, symbol: cfg.gasToken, decimals: 18 },
    rpcUrls: { default: { http: [cfg.proxyUrl] } },
  } as const;
}

export async function deploySolCross() {
  const cfg = loadConfig();
  console.log(`\n======================================================`);
  console.log(`  SOLCROSS VAULT DEPLOYMENT - ROME PROTOCOL`);
  console.log(`======================================================`);
  console.log(`Target Network : ${cfg.name} (Chain ID: ${cfg.chainId})`);
  console.log(`RPC URL        : ${cfg.proxyUrl}`);
  console.log(`Rome Program ID: ${cfg.programId}`);
  console.log(`wUSDC Wrapper  : ${cfg.wusdc}`);
  console.log(`USDC Mint (SPL): ${cfg.usdcMint}`);

  const rawKey = process.env.PRIVATE_KEY || process.env.ROME_EVM_KEY;
  if (!rawKey) {
    console.error("\n❌ ERROR: PRIVATE_KEY or ROME_EVM_KEY not provided in .env");
    console.log("Please create a .env file with:");
    console.log("PRIVATE_KEY=0xYourPrivateKeyHere");
    console.log("Need test gas? Run: rome fund hadrian --from solana ...\n");
    process.exit(1);
  }

  const formattedKey = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as Hex;
  const account = privateKeyToAccount(formattedKey);
  const chain = romeChain(cfg);

  const publicClient = createPublicClient({ chain, transport: http(cfg.proxyUrl) });
  const walletClient = createWalletClient({ account, chain, transport: http(cfg.proxyUrl) });

  console.log(`Deployer EVM Address: ${account.address}`);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer Gas Balance: ${Number(balance) / 1e18} ${cfg.gasToken}`);

  if (balance === 0n) {
    console.warn("\n⚠️ WARNING: Your balance is 0. Ensure you have USDC gas on Hadrian.");
    console.warn("Deploying on Rome allocates on-chain Solana state and requires ~0.1 - 0.5 USDC gas.\n");
  }

  const artifact = JSON.parse(
    readFileSync(resolve(root, "artifacts/SolCrossVault.json"), "utf8")
  );

  // Default target Solana parameters (Solana Devnet Lending / Mock Market Account)
  // Can be updated post-deployment via setStrategyParams
  const solanaProgramId = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex;
  const solanaMarketAccount = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex;
  const solanaReserveAta = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex;

  // Convert usdcMint base58 to 32 bytes hex if needed
  // Circle Devnet USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
  const usdcMintBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex;

  console.log("\nBroadcasting deployment transaction to Rome EVM...");
  const gasPrice = await publicClient.getGasPrice();

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [
      cfg.wusdc,
      usdcMintBytes32,
      solanaProgramId,
      solanaMarketAccount,
      solanaReserveAta,
    ],
    gas: 26_000_000n, // Standard Rome contract creation gas
    maxFeePerGas: (gasPrice * 3n) / 2n,
    maxPriorityFeePerGas: 0n,
  });

  console.log(`Transaction submitted! Hash: ${hash}`);
  console.log(`Tracking settlement on Solana L1...`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success" || !receipt.contractAddress) {
    throw new Error(`Deployment failed on-chain with status: ${receipt.status}`);
  }

  const deployedAddress = receipt.contractAddress;
  console.log(`\n🎉 SUCCESS! PortusMaxVault deployed to: ${deployedAddress}`);
  console.log(`Rome Explorer: ${cfg.explorerUrl}/address/${deployedAddress}`);
  console.log(`Solana Program: https://explorer.solana.com/address/${cfg.programId}?cluster=${cfg.solanaCluster}`);

  // Write deployment output to config
  const deployedConfig = {
    network: cfg.name,
    chainId: cfg.chainId,
    vaultAddress: deployedAddress,
    wusdc: cfg.wusdc,
    deployedAt: new Date().toISOString(),
    txHash: hash,
  };

  writeFileSync(
    resolve(root, "deployed-address.json"),
    JSON.stringify(deployedConfig, null, 2),
    "utf8"
  );

  console.log("\n======================================================");
  console.log("  NEXT STEPS FOR ROME ARENA SUBMISSION:");
  console.log("======================================================");
  console.log("1. Go to: https://arena.mainnet.romeprotocol.xyz/apps/new");
  console.log(`2. Register App: 'SolCross Yield Port'`);
  console.log(`3. Chain: Hadrian (200010)`);
  console.log(`4. Contract Address: ${deployedAddress}`);
  console.log("5. Start accumulating Laurels from on-chain TVL & volume!\n");

  return deployedAddress;
}

if (process.argv[1]?.replace(/\\/g, "/").includes("scripts/deploy")) {
  deploySolCross().catch((err) => {
    console.error("Deployment failed:", err);
    process.exit(1);
  });
}
