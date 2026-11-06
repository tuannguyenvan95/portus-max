import "dotenv/config";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createWalletClient, createPublicClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { loadConfig } from "./config.js";
import { romeChain } from "./deploy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

export async function rebalanceVault() {
  const cfg = loadConfig();
  const addressFile = resolve(root, "deployed-address.json");

  let vaultAddress = process.env.VAULT_ADDRESS as Hex;
  if (!vaultAddress && existsSync(addressFile)) {
    const data = JSON.parse(readFileSync(addressFile, "utf8"));
    vaultAddress = data.vaultAddress;
  }

  if (!vaultAddress) {
    throw new Error("No VAULT_ADDRESS found. Deploy first using 'npm run deploy' or set VAULT_ADDRESS in .env");
  }

  const rawKey = process.env.PRIVATE_KEY || process.env.ROME_EVM_KEY;
  if (!rawKey) throw new Error("No PRIVATE_KEY or ROME_EVM_KEY set in .env");

  const account = privateKeyToAccount((rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as Hex);
  const chain = romeChain(cfg);
  const publicClient = createPublicClient({ chain, transport: http(cfg.proxyUrl) });
  const walletClient = createWalletClient({ account, chain, transport: http(cfg.proxyUrl) });

  const artifact = JSON.parse(readFileSync(resolve(root, "artifacts/SolCrossVault.json"), "utf8"));

  console.log(`\n--- Calling Atomic Cross-Runtime Rebalance ---`);
  console.log(`Vault: ${vaultAddress}`);
  console.log(`Manager: ${account.address}`);

  const totalAssets = await publicClient.readContract({
    address: vaultAddress,
    abi: artifact.abi,
    functionName: "totalAssets",
  }) as bigint;

  const idleAssets = await publicClient.readContract({
    address: vaultAddress,
    abi: artifact.abi,
    functionName: "idleAssets",
  }) as bigint;

  const solanaAllocated = await publicClient.readContract({
    address: vaultAddress,
    abi: artifact.abi,
    functionName: "solanaAllocatedAssets",
  }) as bigint;

  console.log(`Total Assets      : ${Number(totalAssets) / 1e6} USDC`);
  console.log(`Idle (EVM) Buffer : ${Number(idleAssets) / 1e6} USDC`);
  console.log(`Solana Deployed   : ${Number(solanaAllocated) / 1e6} USDC`);

  console.log("\nExecuting rebalance() via Rome Precompiles...");
  const gasPrice = await publicClient.getGasPrice();

  const hash = await walletClient.writeContract({
    address: vaultAddress,
    abi: artifact.abi,
    functionName: "rebalance",
    gas: 5_000_000n,
    maxFeePerGas: (gasPrice * 3n) / 2n,
    maxPriorityFeePerGas: 0n,
  });

  console.log(`Transaction sent: ${hash}`);
  const rcpt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`Settled on Solana in tx: ${rcpt.transactionHash} (Status: ${rcpt.status})`);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  rebalanceVault().catch(console.error);
}
