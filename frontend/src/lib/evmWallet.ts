import type { FrontendConfig } from "./config";

// Store EIP-6963 discovered providers
let eip6963MetaMaskProvider: any = null;

if (typeof window !== "undefined") {
  window.addEventListener("eip6963:announceProvider", (event: any) => {
    const info = event?.detail?.info;
    const provider = event?.detail?.provider;

    // Detect true MetaMask (RDNS: io.metamask or name contains MetaMask, not Phantom)
    if (
      info?.rdns === "io.metamask" ||
      (provider?.isMetaMask && !provider?.isPhantom)
    ) {
      eip6963MetaMaskProvider = provider;
    }
  });

  // Request all installed EVM wallets to announce themselves
  try {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  } catch (e) {}
}

export function getInjectedEvmProvider() {
  if (typeof window === "undefined") return null;
  const anyWindow = window as any;

  // 1. First priority: EIP-6963 announced MetaMask
  if (eip6963MetaMaskProvider) {
    return eip6963MetaMaskProvider;
  }

  // 2. Second priority: Explicit MetaMask in ethereum.providers
  if (anyWindow.ethereum?.providers?.length) {
    const mm = anyWindow.ethereum.providers.find(
      (p: any) => p.isMetaMask && !p.isPhantom
    );
    if (mm) return mm;
    const rabby = anyWindow.ethereum.providers.find((p: any) => p.isRabby);
    if (rabby) return rabby;
    const nonPhantom = anyWindow.ethereum.providers.find((p: any) => !p.isPhantom);
    if (nonPhantom) return nonPhantom;
    return anyWindow.ethereum.providers[0];
  }

  // 3. Third priority: window.ethereum IF not hijacked by Phantom
  if (anyWindow.ethereum && !anyWindow.ethereum.isPhantom) {
    return anyWindow.ethereum;
  }

  // 4. Fallback if only Phantom is present
  if (anyWindow.ethereum) {
    return anyWindow.ethereum;
  }

  return null;
}

export function isPhantomOverridingEvm(): boolean {
  if (typeof window === "undefined") return false;
  const anyWindow = window as any;
  return !!(anyWindow.ethereum?.isPhantom && !eip6963MetaMaskProvider && (!anyWindow.ethereum?.providers || anyWindow.ethereum.providers.length <= 1));
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

  // Warning if Phantom has taken over window.ethereum
  if (provider.isPhantom) {
    console.warn("Notice: Phantom EVM provider is active. If errors occur, disable 'Default EVM App' in Phantom settings.");
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
      console.warn("Could not auto-add Rome chain:", addError);
    }
  }

  return account;
}
