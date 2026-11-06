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
  Code2
} from "lucide-react";
import { encodeDeployData, createPublicClient, http, type Hex } from "viem";
import { VAULT_ABI, VAULT_BYTECODE } from "../lib/vaultContractData";
import { getInjectedEvmProvider } from "../lib/evmWallet";
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
  const [status, setStatus] = useState<"idle" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [deployedContract, setDeployedContract] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      // 1. Ensure the EVM account is explicitly requested on this specific provider (avoids Phantom intercept)
      let activeAccount = evmAddress;
      try {
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          activeAccount = accounts[0];
        }
      } catch (authErr: any) {
        if (authErr.code === -32002) {
          throw new Error("Connection request already pending in your wallet extension. Please open MetaMask to approve.");
        }
      }

      if (!activeAccount) {
        throw new Error("No authorized EVM account found. Please connect MetaMask.");
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
      setErrorMessage(err.message || "Failed to deploy contract via MetaMask.");
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Manual MetaMask Deploy
                </span>
              </h2>
              <p className="text-xs text-rome-textDim">
                Deploy your own on-chain contract instance on Rome with 1-click confirmation in MetaMask
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[65vh] overflow-y-auto">
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

          {/* Success Result View */}
          {status === "success" && deployedContract && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Check className="w-5 h-5" />
                <span>Contract Successfully Deployed to Rome Hadrian!</span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Your New SolCross Vault Address:</div>
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
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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

            {status !== "success" && (
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
