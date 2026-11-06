import React, { useState } from "react";
import { 
  X, 
  Rocket, 
  Check, 
  Copy, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowUpRight,
  Code2,
  Terminal,
  Settings,
  HelpCircle
} from "lucide-react";
import { encodeDeployData, createPublicClient, http, type Hex, isAddress } from "viem";
import { VAULT_ABI, VAULT_BYTECODE } from "../lib/vaultContractData";
import { getInjectedEvmProvider, isPhantomOverridingEvm } from "../lib/evmWallet";
import type { FrontendConfig } from "../lib/config";
import confetti from "canvas-confetti";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FrontendConfig;
  evmAddress: string | null;
  onConnectEvm: () => void;
  onDeployed?: (newAddress: Hex) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  config,
  evmAddress,
  onConnectEvm,
  onDeployed,
}) => {
  const [activeTab, setActiveTab] = useState<"metamask" | "manual">("metamask");
  const [status, setStatus] = useState<"idle" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [deployedContract, setDeployedContract] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  if (!isOpen) return null;

  const phantomOverriding = isPhantomOverridingEvm();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBindCustomAddress = () => {
    if (!isAddress(customAddress)) {
      setCustomError("Please enter a valid 42-character EVM address (0x...)");
      return;
    }
    if (onDeployed) {
      onDeployed(customAddress as Hex);
    }
    setDeployedContract(customAddress);
    setStatus("success");
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleDeploy = async () => {
    const provider = getInjectedEvmProvider();

    if (!provider) {
      onConnectEvm();
      return;
    }

    try {
      setStatus("submitting");
      setErrorMessage(null);
      setTxHash(null);
      setDeployedContract(null);

      // 1. Force explicit permission authorization in MetaMask
      let activeAccount = evmAddress;
      try {
        await provider.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (permErr: any) {
        if (permErr.code === -32002) {
          throw new Error("MetaMask is already waiting for your approval. Please click the fox icon in your browser toolbar to approve.");
        }
        if (permErr.code === 4001) {
          throw new Error("Connection was cancelled in MetaMask. Please approve the connection to deploy.");
        }
      }

      // 2. Fetch the active authorized account
      const accounts = await provider.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        activeAccount = accounts[0];
      } else {
        const reqAccounts = await provider.request({ method: "eth_requestAccounts" });
        if (reqAccounts && reqAccounts.length > 0) {
          activeAccount = reqAccounts[0];
        } else {
          throw new Error("No authorized EVM account found. Please open MetaMask and authorize this site.");
        }
      }

      // 2. Ensure chain is switched to Rome Hadrian
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
        } catch (addError: any) {}
      }

      const zeroBytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex;

      // 3. Encode Constructor Arguments: [wUSDC, usdcMintBytes32, solProgramId, solMarketAccount, solReserveAta]
      const deployData = encodeDeployData({
        abi: VAULT_ABI,
        bytecode: VAULT_BYTECODE,
        args: [
          config.wusdcAddress,
          zeroBytes32,
          zeroBytes32,
          zeroBytes32,
          zeroBytes32,
        ],
      });

      // 4. Request contract deployment via MetaMask directly
      const hash: string = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: activeAccount,
            data: deployData,
          },
        ],
      });

      setTxHash(hash);
      setStatus("confirming");

      // 5. Poll transaction receipt on Rome EVM node
      const publicClient = createPublicClient({
        transport: http(config.rpcUrl),
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash as Hex,
      });

      if (receipt.status === "success" && receipt.contractAddress) {
        setDeployedContract(receipt.contractAddress);
        setStatus("success");
        if (onDeployed) {
          onDeployed(receipt.contractAddress as Hex);
        }
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#14F195", "#3B82F6", "#9945FF", "#F59E0B"],
          });
        } catch (e) {}
      } else {
        throw new Error(`Deployment transaction completed with status: ${receipt.status}`);
      }
    } catch (err: any) {
      console.error("Manual deployment error:", err);
      setStatus("error");
      if (err?.message?.includes("not been authorized") || err?.code === 4100) {
        setErrorMessage(
          "MetaMask account is not yet connected/authorized for this domain. To fix in 5 seconds: Open your MetaMask extension icon in browser toolbar ➔ Click the 3 dots (⋮) at top right of MetaMask ➔ 'Connected sites' ➔ Click 'Manually connect to current site' ➔ Click 'Connect', then click Deploy again."
        );
      } else {
        setErrorMessage(err.message || "Failed to deploy contract via MetaMask.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-rome-card border border-rome-border rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-rome-border/80 flex items-center justify-between bg-rome-dark/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-solanaGlow">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Deploy Personal SolCross Vault</span>
              </h2>
              <p className="text-xs text-rome-textDim">
                Deploy your own on-chain contract instance on Rome Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-rome-border/60 px-6 bg-rome-dark/30 text-xs font-bold">
          <button
            onClick={() => setActiveTab("metamask")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "metamask"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>1-Click MetaMask</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "manual"
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal / Custom Address</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[65vh] overflow-y-auto">
          {activeTab === "metamask" && (
            <>
              {/* Phantom conflict notice if detected */}
              {phantomOverriding && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                  <div className="font-bold flex items-center gap-2 text-sm text-amber-200">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Important: Phantom Default EVM Conflict</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-amber-200/90">
                    Phantom extension is currently set as your browser's default EVM wallet, which blocks custom Rome EVM chains.
                    To let MetaMask pop up: Open <strong>Phantom extension ➔ Settings (⚙️) ➔ Developer Settings ➔ Default Ethereum App ➔ Turn OFF</strong> (or choose MetaMask), then refresh.
                  </p>
                </div>
              )}

              {/* Why deploy info */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>100% Non-Custodial & Safe</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  No private keys are typed or exposed. MetaMask will pop up directly in your browser, allowing you to review 
                  and confirm the contract creation transaction by your own hand. You will be recorded as the contract 
                  <strong> Owner & Deployer</strong>.
                </p>
              </div>

              {/* Parameters Inspection */}
              <div className="p-4 rounded-2xl bg-rome-dark/70 border border-rome-border space-y-3 font-mono">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  Deployment Parameters ({config.chainName})
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-rome-border/40">
                    <span className="text-slate-400">Target Chain:</span>
                    <span className="text-white font-bold">{config.chainName} (ID: {config.chainId})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-rome-border/40">
                    <span className="text-slate-400">Underlying Asset (wUSDC):</span>
                    <span className="text-blue-400 truncate max-w-[240px]">{config.wusdcAddress}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-rome-border/40">
                    <span className="text-slate-400">Rome CPI Precompile:</span>
                    <span className="text-purple-400">0xFF00000000000000000000000000000000000008</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Deployer Address:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[240px]">
                      {evmAddress || "MetaMask not connected"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "manual" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rome-dark/70 border border-rome-border space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Option A: Deploy via Project CLI Script</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  You can deploy directly from your local terminal using the pre-configured script:
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400">
                  npx tsx scripts/deploy.ts hadrian
                </div>
                <p className="text-[11px] text-slate-400">
                  Provide your deployer private key in <code className="text-white">.env</code> (<code className="text-slate-300">PRIVATE_KEY=0x...</code>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rome-dark/70 border border-rome-border space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Option B: Bind An Already Deployed Contract</span>
                </div>
                <p className="text-slate-400 text-xs">
                  If you already deployed a vault contract on Rome Hadrian, paste its address below to bind it to this app:
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={customAddress}
                    onChange={(e) => {
                      setCustomAddress(e.target.value.trim());
                      setCustomError(null);
                    }}
                    className="w-full bg-rome-dark border border-rome-border focus:border-blue-500 rounded-xl p-3 font-mono text-xs text-white outline-none"
                  />
                  {customError && (
                    <div className="text-red-400 text-[11px]">{customError}</div>
                  )}
                  <button
                    onClick={handleBindCustomAddress}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Bind Contract Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Result View */}
          {status === "success" && deployedContract && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Check className="w-5 h-5" />
                <span>Contract Active & Bound to SolCross!</span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Your SolCross Vault Address:</div>
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-white">
                  <span className="truncate font-bold text-emerald-300">{deployedContract}</span>
                  <button
                    onClick={() => handleCopy(deployedContract)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`${config.explorerUrl}/address/${deployedContract}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-white underline font-mono"
                >
                  <span>View on Rome Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://arena.mainnet.romeprotocol.xyz/apps/new"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-glow hover:opacity-90"
                >
                  <span>Register in Arena</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-rome-border/80 bg-rome-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {status === "confirming" ? (
              <span className="flex items-center gap-2 text-cyan-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Confirming on Rome Hadrian & Solana L1 (~400ms)...</span>
              </span>
            ) : status === "submitting" ? (
              <span>Please confirm the transaction in MetaMask...</span>
            ) : (
              <span>Requires ~0.1 - 0.5 testnet USDC for gas on Hadrian</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              {status === "success" ? "Done" : "Cancel"}
            </button>

            {status !== "success" && activeTab === "metamask" && (
              <button
                onClick={handleDeploy}
                disabled={status === "submitting" || status === "confirming"}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-xs shadow-solanaGlow hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === "submitting" || status === "confirming" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : !evmAddress ? (
                  <span>Connect MetaMask</span>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Deploy via MetaMask</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
