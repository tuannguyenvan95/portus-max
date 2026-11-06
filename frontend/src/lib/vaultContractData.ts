// Auto-generated SolCrossVault ABI and Bytecode for in-browser deployment
export const VAULT_ABI = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_underlyingAsset",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_usdcMint",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_solanaProgramId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_solanaMarketAccount",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_solanaReserveAta",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldBps",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newBps",
        "type": "uint256"
      }
    ],
    "name": "AllocationTargetUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "solanaProgram",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dataLength",
        "type": "uint256"
      }
    ],
    "name": "CrossActionExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "recalledAssets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "EmergencyShutdown",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "idleAssets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "solanaAllocatedAssets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "movedAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isDepositToSolana",
        "type": "bool"
      }
    ],
    "name": "StrategyRebalanced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "programId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "marketAccount",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "reserveAta",
        "type": "bytes32"
      }
    ],
    "name": "StrategyUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yieldAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newTotalAssets",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "YieldHarvested",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BPS_DENOMINATOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "asset",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "convertToAssets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "name": "convertToShares",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentApyBps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyRecall",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "programId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "targetAccount",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "ixData",
        "type": "bytes"
      }
    ],
    "name": "executeCrossAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "earnedAmount",
        "type": "uint256"
      }
    ],
    "name": "harvestYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "idleAssets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastHarvestTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "maxDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "maxMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ownerAccount",
        "type": "address"
      }
    ],
    "name": "maxRedeem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ownerAccount",
        "type": "address"
      }
    ],
    "name": "maxWithdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "name": "previewDeposit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "previewMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "previewRedeem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "name": "previewWithdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rebalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "ownerAccount",
        "type": "address"
      }
    ],
    "name": "redeem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newBps",
        "type": "uint256"
      }
    ],
    "name": "setAllocationTarget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_apyBps",
        "type": "uint256"
      }
    ],
    "name": "setApyEstimate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "setPaused",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_solanaProgramId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_solanaMarketAccount",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_solanaReserveAta",
        "type": "bytes32"
      }
    ],
    "name": "setStrategyParams",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "solanaAllocatedAssets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "solanaMarketAccount",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "solanaProgramId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "solanaReserveAta",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "strategyManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "targetSolanaAllocationBps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalYieldHarvested",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "underlyingAsset",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdcMint",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "ownerAccount",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const VAULT_BYTECODE = "0x60c0604052611d4c60075561036b600d5534801561001b575f5ffd5b5060405161289f38038061289f83398101604081905261003a916100cd565b6001600160a01b0385166100845760405162461bcd60e51b815260206004820152600d60248201526c125b9d985b1a5908185cdcd95d609a1b604482015260640160405180910390fd5b60038054336001600160a01b031991821681179092556004805490911690911790556001600160a01b039490941660805260a092909252600855600955600a5542600c5561011d565b5f5f5f5f5f60a086880312156100e1575f5ffd5b85516001600160a01b03811681146100f7575f5ffd5b602087015160408801516060890151608090990151929a91995097965090945092505050565b60805160a05161273e6101615f395f6102ef01525f818161044c0152818161052301528181610cf4015281816110fa015281816114ae01526117f8015261273e5ff3fe608060405234801561000f575f5ffd5b50600436106102cb575f3560e01c806370a082311161017b578063b8775cde116100e4578063ce96cb771161009e578063e16b03a311610079578063e16b03a31461069d578063e1a45218146106a6578063ebd0b75f146106af578063ef8b30f714610390575f5ffd5b8063ce96cb7714610638578063d905777e1461064b578063dd62ed3e14610673575f5ffd5b8063b8775cde146105ed578063ba08765214610600578063c63d75b61461049f578063c6e6f59214610613578063ca1ca0fc14610626578063caa12be01461062f575f5ffd5b806394bf804d1161013557806394bf804d1461057c57806395d89b411461058f578063a9059cbb146105b4578063b3d7f6b9146104b2578063b460af94146105c7578063b6b55f25146105da575f5ffd5b806370a08231146104ff5780637158da7c1461051e5780637d7c2a1c146105455780637d9189e01461054d57806384511503146105565780638da5cb5b14610569575f5ffd5b806322a6619e1161023757806339b70e38116101f15780634cdad506116101cc5780634cdad506146104b25780635c63ac59146104c55780635c975abb146104d85780636e553f65146104ec575f5ffd5b806339b70e381461048457806339cb27c614610497578063402d267d1461049f575f5ffd5b806322a6619e146103ee57806323b872dd146103f757806323bf20261461040a5780632e1a7d4d1461041d578063313ce5671461043057806338d52e0f1461044a575f5ffd5b80630d962691116102885780630d962691146103a3578063162517c8146103b857806316c38b3c146103c157806318160ddd146103d45780631d357690146103dc5780632257a738146103e5575f5ffd5b806301e1d114146102cf578063045e8fb5146102ea57806306fdde031461031157806307a2d13a1461035a578063095ea7b31461036d5780630a28a47714610390575b5f5ffd5b6102d76106b8565b6040519081526020015b60405180910390f35b6102d77f000000000000000000000000000000000000000000000000000000000000000081565b61034d6040518060400160405280601981526020017f536f6c43726f7373205969656c6420506f72742053686172650000000000000081525081565b6040516102e191906121c8565b6102d76103683660046121da565b6106ce565b61038061037b366004612207565b610703565b60405190151581526020016102e1565b6102d761039e3660046121da565b61076f565b6103b66103b13660046121da565b610779565b005b6102d7600d5481565b6103b66103cf36600461223f565b6107c6565b6102d75f5481565b6102d760095481565b6102d7600c5481565b6102d7600b5481565b61038061040536600461225a565b61080e565b6103b66104183660046121da565b610957565b6102d761042b3660046121da565b6109ff565b610438600681565b60405160ff90911681526020016102e1565b7f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020016102e1565b60045461046c906001600160a01b031681565b6103b6610a0b565b6102d76104ad366004612294565b610a96565b6102d76104c03660046121da565b610ab7565b6103b66104d33660046121da565b610ac1565b60045461038090600160a01b900460ff1681565b6102d76104fa3660046122ad565b610bb4565b6102d761050d366004612294565b60016020525f908152604090205481565b61046c7f000000000000000000000000000000000000000000000000000000000000000081565b6103b6610e28565b6102d760085481565b6103b66105643660046122d7565b610e71565b60035461046c906001600160a01b031681565b6102d761058a3660046122ad565b61100d565b61034d6040518060400160405280600681526020016573635553444360d01b81525081565b6103806105c2366004612207565b611224565b6102d76105d5366004612353565b6112cb565b6102d76105e83660046121da565b6115b3565b6103b66105fb36600461238c565b6115ee565b6102d761060e366004612353565b61166d565b6102d76106213660046121da565b6118f2565b6102d760075481565b6102d760065481565b6102d7610646366004612294565b611936565b6102d7610659366004612294565b6001600160a01b03165f9081526001602052604090205490565b6102d76106813660046123b5565b600260209081525f928352604080842090915290825290205481565b6102d760055481565b6102d761271081565b6102d7600a5481565b5f6006546005546106c991906123f1565b905090565b5f80548082036106df575090919050565b806106e86106b8565b6106f29085612404565b6106fc919061241b565b9392505050565b335f8181526002602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061075d9086815260200190565b60405180910390a35060015b92915050565b5f610769826118f2565b6003546001600160a01b031633148061079c57506004546001600160a01b031633145b6107c15760405162461bcd60e51b81526004016107b89061243a565b60405180910390fd5b600d55565b6003546001600160a01b031633146107f05760405162461bcd60e51b81526004016107b890612471565b60048054911515600160a01b0260ff60a01b19909216919091179055565b6001600160a01b0383165f9081526002602090815260408083203384529091528120545f19811461088157828110156108595760405162461bcd60e51b81526004016107b8906124a8565b6001600160a01b0385165f908152600260209081526040808320338452909152902083820390555b6001600160a01b0385165f908152600160205260409020548311156108b85760405162461bcd60e51b81526004016107b8906124df565b6001600160a01b0385165f90815260016020526040812080548592906108df908490612521565b90915550506001600160a01b0384165f908152600160205260408120805485929061090b9084906123f1565b92505081905550836001600160a01b0316856001600160a01b03165f5160206126e95f395f51905f528560405161094491815260200190565b60405180910390a3506001949350505050565b6003546001600160a01b031633146109815760405162461bcd60e51b81526004016107b890612471565b6127108111156109be5760405162461bcd60e51b81526020600482015260086024820152674d6178203130302560c01b60448201526064016107b8565b60075460408051918252602082018390527f9cabc0c513221112d42c3dd76271bfad16289336e58f013b1375bcaee2fa4394910160405180910390a1600755565b5f6107698233336112cb565b6003546001600160a01b03163314610a355760405162461bcd60e51b81526004016107b890612471565b6004805460ff60a01b1916600160a01b1790556006548015610a5a57610a5a81611957565b604080518281524260208201527f95bd051e7dd22910ab687acb3354d17e1c0c04744f811dcfbb8fa440d543a42391015b60405180910390a150565b6004545f90600160a01b900460ff16610ab0575f19610769565b5f92915050565b5f610769826106ce565b6003546001600160a01b0316331480610ae457506004546001600160a01b031633145b610b005760405162461bcd60e51b81526004016107b89061243a565b5f8111610b3c5760405162461bcd60e51b815260206004820152600a60248201526916995c9bc81e5a595b1960b21b60448201526064016107b8565b8060065f828254610b4d91906123f1565b9250508190555080600b5f828254610b6591906123f1565b909155505042600c557f46eee0760c564660379a99fd69bc8669b19dba864b3053d7dbb597d0cfbfb26681610b986106b8565b6040805192835260208301919091524290820152606001610a8b565b6004545f90600160a01b900460ff1615610be05760405162461bcd60e51b81526004016107b890612534565b5f8311610c285760405162461bcd60e51b815260206004820152601660248201527514dbdb10dc9bdcdcce881e995c9bc819195c1bdcda5d60521b60448201526064016107b8565b6001600160a01b038216610c785760405162461bcd60e51b815260206004820152601760248201527629b7b621b937b9b99d103d32b937903932b1b2b4bb32b960491b60448201526064016107b8565b610c81836118f2565b90505f8111610cd25760405162461bcd60e51b815260206004820152601c60248201527f536f6c43726f73733a207a65726f20736861726573206d696e7465640000000060448201526064016107b8565b6040516323b872dd60e01b8152336004820152306024820152604481018490527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015610d42573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d669190612564565b610db25760405162461bcd60e51b815260206004820152601d60248201527f536f6c43726f73733a207472616e7366657246726f6d206661696c656400000060448201526064016107b8565b610dbc8282611be6565b8260055f828254610dcd91906123f1565b90915550610ddb9050611c59565b60408051848152602081018390526001600160a01b0384169133917fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d791015b60405180910390a392915050565b6003546001600160a01b0316331480610e4b57506004546001600160a01b031633145b610e675760405162461bcd60e51b81526004016107b89061243a565b610e6f611cd1565b565b6003546001600160a01b0316331480610e9457506004546001600160a01b031633145b610eb05760405162461bcd60e51b81526004016107b89061243a565b83610ef25760405162461bcd60e51b8152602060048201526012602482015271125b9d985b1a59081c1c9bd9dc985b48125160721b60448201526064016107b8565b6040805160018082528183019092525f91816020015b604080516060810182525f80825260208083018290529282015282525f19909201910181610f0857905050905060405180606001604052808581526020015f1515815260200160011515815250815f81518110610f6757610f6761257f565b6020908102919091010152604051633a4065c360e11b8152600860ff60981b0190637480cb8690610fa29088908590889088906004016125ed565b5f604051808303815f87803b158015610fb9575f5ffd5b505af1158015610fcb573d5f5f3e3d5ffd5b50506040518481523392508791507f0945a96e15bf0917009d52a2ac128ee11f17f8ab7a2bdabdc1f4e2c9802dfe729060200160405180910390a35050505050565b6004545f90600160a01b900460ff16156110395760405162461bcd60e51b81526004016107b890612534565b5f831161107e5760405162461bcd60e51b815260206004820152601360248201527214dbdb10dc9bdcdcce881e995c9bc81b5a5b9d606a1b60448201526064016107b8565b611087836106ce565b90505f81116110d85760405162461bcd60e51b815260206004820152601c60248201527f536f6c43726f73733a207a65726f20617373657473206e65656465640000000060448201526064016107b8565b6040516323b872dd60e01b8152336004820152306024820152604481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015611148573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061116c9190612564565b6111b85760405162461bcd60e51b815260206004820152601d60248201527f536f6c43726f73733a207472616e7366657246726f6d206661696c656400000060448201526064016107b8565b6111c28284611be6565b8060055f8282546111d391906123f1565b909155506111e19050611c59565b60408051828152602081018590526001600160a01b0384169133917fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d79101610e1a565b335f908152600160205260408120548211156112525760405162461bcd60e51b81526004016107b8906124df565b335f9081526001602052604081208054849290611270908490612521565b90915550506001600160a01b0383165f908152600160205260408120805484929061129c9084906123f1565b90915550506040518281526001600160a01b0384169033905f5160206126e95f395f51905f529060200161075d565b5f5f841161131b5760405162461bcd60e51b815260206004820152601760248201527f536f6c43726f73733a207a65726f20776974686472617700000000000000000060448201526064016107b8565b6001600160a01b03831661136b5760405162461bcd60e51b815260206004820152601760248201527629b7b621b937b9b99d103d32b937903932b1b2b4bb32b960491b60448201526064016107b8565b611374846118f2565b90505f81116113bd5760405162461bcd60e51b8152602060048201526015602482015274536f6c43726f73733a207a65726f2073686172657360581b60448201526064016107b8565b336001600160a01b03831614611442576001600160a01b0382165f9081526002602090815260408083203384529091529020545f19811461144057818110156114185760405162461bcd60e51b81526004016107b8906124a8565b6001600160a01b0383165f908152600260209081526040808320338452909152902082820390555b505b61144c8282611d67565b836005541015611472575f600554856114659190612521565b905061147081611957565b505b8360055f8282546114839190612521565b909155505060405163a9059cbb60e01b81526001600160a01b038481166004830152602482018690527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af11580156114f4573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906115189190612564565b6115605760405162461bcd60e51b815260206004820152601960248201527814dbdb10dc9bdcdcce881d1c985b9cd9995c8819985a5b1959603a1b60448201526064016107b8565b60408051858152602081018390526001600160a01b03808516929086169133917ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db91015b60405180910390a49392505050565b6004545f90600160a01b900460ff16156115df5760405162461bcd60e51b81526004016107b890612534565b6107698233610bb4565b919050565b6003546001600160a01b031633146116185760405162461bcd60e51b81526004016107b890612471565b60088390556009829055600a81905560408051848152602081018490529081018290527fc80b67d61341cb8395921c07fa625ebbcdc24e8f13ccd8bbc0446b9a58ec10ef9060600160405180910390a1505050565b5f5f84116116b55760405162461bcd60e51b8152602060048201526015602482015274536f6c43726f73733a207a65726f2073686172657360581b60448201526064016107b8565b6116be846106ce565b90505f81116117075760405162461bcd60e51b8152602060048201526015602482015274536f6c43726f73733a207a65726f2061737365747360581b60448201526064016107b8565b336001600160a01b0383161461178c576001600160a01b0382165f9081526002602090815260408083203384529091529020545f19811461178a57848110156117625760405162461bcd60e51b81526004016107b8906124a8565b6001600160a01b0383165f908152600260209081526040808320338452909152902085820390555b505b6117968285611d67565b8060055410156117bc575f600554826117af9190612521565b90506117ba81611957565b505b8060055f8282546117cd9190612521565b909155505060405163a9059cbb60e01b81526001600160a01b038481166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af115801561183e573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118629190612564565b6118aa5760405162461bcd60e51b815260206004820152601960248201527814dbdb10dc9bdcdcce881d1c985b9cd9995c8819985a5b1959603a1b60448201526064016107b8565b60408051828152602081018690526001600160a01b03808516929086169133917ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db91016115a4565b5f5f6118fc6106b8565b5f5490915080158061190c575081155b1561191957509192915050565b816119248286612404565b61192e919061241b565b949350505050565b6001600160a01b0381165f90815260016020526040812054610769906106ce565b60065481111561196657506006545b60085415611b6e57604080516003808252608082019092525f91816020015b604080516060810182525f80825260208083018290529282015282525f1990920191018161198557905050604051638854a29960e01b81523060048201529091505f90600960ff60981b0190638854a29990602401602060405180830381865afa1580156119f5573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611a199190612638565b905060405180606001604052808281526020015f1515815260200160011515815250825f81518110611a4d57611a4d61257f565b6020026020010181905250604051806060016040528060095481526020015f151581526020016001151581525082600181518110611a8d57611a8d61257f565b60200260200101819052506040518060600160405280600a5481526020015f151581526020016001151581525082600281518110611acd57611acd61257f565b60200260200101819052505f6002611ae485611e3b565b604051602001611af592919061264f565b60408051601f198184030181525f8352602083019182905260085463b94f373360e01b9092529250600860ff60981b019063b94f373390611b3c9087868660248101612678565b5f604051808303815f87803b158015611b53575f5ffd5b505af1158015611b65573d5f5f3e3d5ffd5b50505050505050505b8060065f828254611b7f9190612521565b925050819055508060055f828254611b9791906123f1565b909155505060055460065460408051928352602083019190915281018290525f60608201527fe3fd2fcf9b8b0cc50aaad047cd5e11147b8a952cc8f3ea4666a3f5b1d7b29c6c90608001610a8b565b805f5f828254611bf691906123f1565b90915550506001600160a01b0382165f9081526001602052604081208054839290611c229084906123f1565b90915550506040518181526001600160a01b038316905f905f5160206126e95f395f51905f52906020015b60405180910390a35050565b5f611c626106b8565b9050805f03611c6e5750565b5f61271060075483611c809190612404565b611c8a919061241b565b9050600654811115611ccd575f60065482611ca59190612521565b90506305f5e1008110158015611cbd57508060055410155b15611ccb57611ccb81611ebc565b505b5050565b5f611cda6106b8565b9050805f03611ce65750565b5f61271060075483611cf89190612404565b611d02919061241b565b9050600654811115611d3d575f60065482611d1d9190612521565b9050600554811115611d2e57506005545b8015611ccb57611ccb81611ebc565b806006541115611ccd575f81600654611d569190612521565b90508015611ccb57611ccb81611957565b6001600160a01b0382165f90815260016020526040902054811115611dce5760405162461bcd60e51b815260206004820152601e60248201527f536f6c43726f73733a206275726e20657863656564732062616c616e6365000060448201526064016107b8565b6001600160a01b0382165f9081526001602052604081208054839290611df5908490612521565b92505081905550805f5f828254611e0c9190612521565b90915550506040518181525f906001600160a01b038416905f5160206126e95f395f51905f5290602001611c4d565b6040805160088082528183019092526060915f91906020820181803683370190505090505f5b6008811015611eb557611e75816008612404565b8467ffffffffffffffff16901c60f81b828281518110611e9757611e9761257f565b60200101906001600160f81b03191690815f1a905350600101611e61565b5092915050565b600554811115611f195760405162461bcd60e51b815260206004820152602260248201527f536f6c43726f73733a20696e73756666696369656e742069646c652061737365604482015261747360f01b60648201526084016107b8565b6008541561212157604080516003808252608082019092525f91816020015b604080516060810182525f80825260208083018290529282015282525f19909201910181611f3857905050604051638854a29960e01b81523060048201529091505f90600960ff60981b0190638854a29990602401602060405180830381865afa158015611fa8573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611fcc9190612638565b905060405180606001604052808281526020015f1515815260200160011515815250825f815181106120005761200061257f565b6020026020010181905250604051806060016040528060095481526020015f1515815260200160011515815250826001815181106120405761204061257f565b60200260200101819052506040518060600160405280600a5481526020015f1515815260200160011515815250826002815181106120805761208061257f565b60200260200101819052505f600161209785611e3b565b6040516020016120a892919061264f565b60408051601f198184030181525f8352602083019182905260085463b94f373360e01b9092529250600860ff60981b019063b94f3733906120ef9087868660248101612678565b5f604051808303815f87803b158015612106575f5ffd5b505af1158015612118573d5f5f3e3d5ffd5b50505050505050505b8060055f8282546121329190612521565b925050819055508060065f82825461214a91906123f1565b90915550506005546006546040805192835260208301919091528101829052600160608201527fe3fd2fcf9b8b0cc50aaad047cd5e11147b8a952cc8f3ea4666a3f5b1d7b29c6c90608001610a8b565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b602081525f6106fc602083018461219a565b5f602082840312156121ea575f5ffd5b5035919050565b80356001600160a01b03811681146115e9575f5ffd5b5f5f60408385031215612218575f5ffd5b612221836121f1565b946020939093013593505050565b801515811461223c575f5ffd5b50565b5f6020828403121561224f575f5ffd5b81356106fc8161222f565b5f5f5f6060848603121561226c575f5ffd5b612275846121f1565b9250612283602085016121f1565b929592945050506040919091013590565b5f602082840312156122a4575f5ffd5b6106fc826121f1565b5f5f604083850312156122be575f5ffd5b823591506122ce602084016121f1565b90509250929050565b5f5f5f5f606085870312156122ea575f5ffd5b8435935060208501359250604085013567ffffffffffffffff81111561230e575f5ffd5b8501601f8101871361231e575f5ffd5b803567ffffffffffffffff811115612334575f5ffd5b876020828401011115612345575f5ffd5b949793965060200194505050565b5f5f5f60608486031215612365575f5ffd5b83359250612375602085016121f1565b9150612383604085016121f1565b90509250925092565b5f5f5f6060848603121561239e575f5ffd5b505081359360208301359350604090920135919050565b5f5f604083850312156123c6575f5ffd5b6123cf836121f1565b91506122ce602084016121f1565b634e487b7160e01b5f52601160045260245ffd5b80820180821115610769576107696123dd565b8082028115828204841417610769576107696123dd565b5f8261243557634e487b7160e01b5f52601260045260245ffd5b500490565b6020808252601e908201527f536f6c43726f73733a20756e617574686f72697a6564206d616e616765720000604082015260600190565b6020808252601d908201527f536f6c43726f73733a2063616c6c6572206973206e6f74206f776e6572000000604082015260600190565b6020808252601c908201527f536f6c43726f73733a20616c6c6f77616e636520657863656564656400000000604082015260600190565b60208082526022908201527f536f6c43726f73733a207472616e7366657220657863656564732062616c616e604082015261636560f01b606082015260800190565b81810381811115610769576107696123dd565b60208082526016908201527514dbdb10dc9bdcdcce881d985d5b1d081c185d5cd95960521b604082015260600190565b5f60208284031215612574575f5ffd5b81516106fc8161222f565b634e487b7160e01b5f52603260045260245ffd5b5f8151808452602084019350602083015f5b828110156125e357815180518752602081015115156020880152604081015115156040880152506060860195506020820191506001810190506125a5565b5093949350505050565b848152606060208201525f6126056060830186612593565b8281036040840152838152838560208301375f602085830101526020601f19601f86011682010191505095945050505050565b5f60208284031215612648575f5ffd5b5051919050565b60ff60f81b8360f81b1681525f82518060208501600185015e5f92016001019182525092915050565b848152608060208201525f6126906080830186612593565b82810360408401526126a2818661219a565b8381036060850152845180825260208087019350909101905f5b818110156126da5783518352602093840193909201916001016126bc565b50909897505050505050505056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220121cf7bae578c1de84172516f398a266e950bd9d71975283b849273b4dd27bff64736f6c63430008260033" as `0x${string}`;
