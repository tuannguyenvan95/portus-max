import type { FrontendConfig } from "./config";

export function getInjectedEvmProvider() {
  if (typeof window === "undefined") return null;
  const anyWindow = window as any;

  // Handle multiple wallets (e.g. MetaMask + Rabby + Phantom)
  if (anyWindow.ethereum?.providers?.length) {
    const mm = anyWindow.ethereum.providers.find((p: any) => p.isMetaMask && !p.isPhantom);
    if (mm) return mm;
    const rabby = anyWindow.ethereum.providers.find((p: any) => p.isRabby);
    if (rabby) return rabby;
    return anyWindow.ethereum.providers[0];
  }

  if (anyWindow.ethereum) {
    return anyWindow.ethereum;
  }

  return null;
}

export async function checkEagerEvmConnection(): Promise<string | null> {
  const provider = getInjectedEvmProvider();
  if (!provider) return null;
  try {
    const accounts = await provider.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
  } catch (e) {
    console.debug("Silent EVM eager check returned:", e);
  }
  return null;
}

export async function connectEvmWallet(config: FrontendConfig): Promise<string> {
  const provider = getInjectedEvmProvider();

  if (!provider) {
    throw new Error(
      "No EVM wallet detected. Please install MetaMask, Rabby, or Coinbase Wallet."
    );
  }

  let accounts: string[] = [];
  try {
    accounts = await provider.request({
      method: "eth_requestAccounts",
    });
  } catch (err: any) {
    if (err.code === -32002) {
      throw new Error(
        "Connection request already pending in your wallet extension. Please open your wallet to approve."
      );
    }
    if (err.code === 4001) {
      throw new Error("Connection request was rejected by user.");
    }
    throw new Error(err.message || "Failed to connect EVM wallet.");
  }

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned from EVM wallet.");
  }

  const account = accounts[0];

  // Try switching to Rome Chain (Hadrian or Rubicon)
  const hexChainId = `0x${config.chainId.toString(16)}`;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    // Error 4902 or unrecognized chain: try adding it
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: config.chainName,
            rpcUrls: [config.rpcUrl],
            nativeCurrency: {
              name: config.networkId === "rubicon" ? "ROME" : "USDC",
              symbol: config.networkId === "rubicon" ? "ROME" : "USDC",
              decimals: 18,
            },
            blockExplorerUrls: [config.explorerUrl],
          },
        ],
      });
    } catch (addError: any) {
      console.warn("Could not auto-add Rome chain (wallet may require manual switch):", addError);
    }
  }

  return account;
}
