// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IERC4626.sol";
import "../rome/interface.sol";

/**
 * @title SolCrossVault
 * @notice Institutional-Grade Dual-Lane Cross-Runtime Yield Port on Rome EVM.
 * @dev Combines ERC-4626 tokenized vault standard with Rome's native Solana CPI engine.
 *      Allows EVM (MetaMask) and Solana (Phantom/Backpack) users to deposit USDC,
 *      which is dynamically deployed via Atomic CPI into Solana DeFi programs
 *      without leaving custody or relying on asynchronous third-party bridges.
 */
contract SolCrossVault is IERC4626 {
    // --- ERC-20 Token Metadata ---
    string public constant override name = "SolCross Yield Port Share";
    string public constant override symbol = "scUSDC";
    uint8 public constant override decimals = 6; // Matches wUSDC (Circle USDC 6-decimals)

    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    // --- Underlying Asset ---
    IERC20 public immutable underlyingAsset;
    bytes32 public immutable usdcMint;

    // --- Governance & Access ---
    address public owner;
    address public strategyManager;
    bool public paused;

    // --- Strategy & Cross-Runtime Accounting ---
    uint256 public idleAssets;
    uint256 public solanaAllocatedAssets;
    uint256 public targetSolanaAllocationBps = 7500; // 75% deployed on Solana, 25% liquid reserve on EVM
    uint256 public constant BPS_DENOMINATOR = 10000;

    // --- Target Solana Program Configuration ---
    bytes32 public solanaProgramId;
    bytes32 public solanaMarketAccount;
    bytes32 public solanaReserveAta;

    // --- Performance Tracking ---
    uint256 public totalYieldHarvested;
    uint256 public lastHarvestTimestamp;
    uint256 public currentApyBps = 875; // 8.75% annualized APY based on active Solana yield

    // --- Events ---
    event StrategyRebalanced(uint256 idleAssets, uint256 solanaAllocatedAssets, uint256 movedAmount, bool isDepositToSolana);
    event YieldHarvested(uint256 yieldAmount, uint256 newTotalAssets, uint256 timestamp);
    event StrategyUpdated(bytes32 programId, bytes32 marketAccount, bytes32 reserveAta);
    event AllocationTargetUpdated(uint256 oldBps, uint256 newBps);
    event EmergencyShutdown(uint256 recalledAssets, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "SolCross: caller is not owner");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == owner || msg.sender == strategyManager, "SolCross: unauthorized manager");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "SolCross: vault paused");
        _;
    }

    constructor(
        IERC20 _underlyingAsset,
        bytes32 _usdcMint,
        bytes32 _solanaProgramId,
        bytes32 _solanaMarketAccount,
        bytes32 _solanaReserveAta
    ) {
        require(address(_underlyingAsset) != address(0), "Invalid asset");
        owner = msg.sender;
        strategyManager = msg.sender;
        underlyingAsset = _underlyingAsset;
        usdcMint = _usdcMint;
        solanaProgramId = _solanaProgramId;
        solanaMarketAccount = _solanaMarketAccount;
        solanaReserveAta = _solanaReserveAta;
        lastHarvestTimestamp = block.timestamp;
    }

    // =========================================================================
    //                            ERC-4626 CORE
    // =========================================================================

    function asset() external view override returns (address) {
        return address(underlyingAsset);
    }

    function totalAssets() public view override returns (uint256) {
        return idleAssets + solanaAllocatedAssets;
    }

    function convertToShares(uint256 assets) public view override returns (uint256) {
        uint256 _totalAssets = totalAssets();
        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0 || _totalAssets == 0) {
            return assets;
        }
        return (assets * _totalSupply) / _totalAssets;
    }

    function convertToAssets(uint256 shares) public view override returns (uint256) {
        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            return shares;
        }
        return (shares * totalAssets()) / _totalSupply;
    }

    function maxDeposit(address) external view override returns (uint256) {
        return paused ? 0 : type(uint256).max;
    }

    function previewDeposit(uint256 assets) external view override returns (uint256) {
        return convertToShares(assets);
    }

    function maxMint(address) external view override returns (uint256) {
        return paused ? 0 : type(uint256).max;
    }

    function previewMint(uint256 shares) external view override returns (uint256) {
        return convertToAssets(shares);
    }

    function maxWithdraw(address ownerAccount) external view override returns (uint256) {
        return convertToAssets(balanceOf[ownerAccount]);
    }

    function previewWithdraw(uint256 assets) external view override returns (uint256) {
        return convertToShares(assets);
    }

    function maxRedeem(address ownerAccount) external view override returns (uint256) {
        return balanceOf[ownerAccount];
    }

    function previewRedeem(uint256 shares) external view override returns (uint256) {
        return convertToAssets(shares);
    }

    // --- Standard Dual-Lane Deposit Entrypoints ---

    function deposit(uint256 assets) external whenNotPaused returns (uint256 shares) {
        return deposit(assets, msg.sender);
    }

    function deposit(uint256 assets, address receiver) public override whenNotPaused returns (uint256 shares) {
        require(assets > 0, "SolCross: zero deposit");
        require(receiver != address(0), "SolCross: zero receiver");

        shares = convertToShares(assets);
        require(shares > 0, "SolCross: zero shares minted");

        require(underlyingAsset.transferFrom(msg.sender, address(this), assets), "SolCross: transferFrom failed");

        _mint(receiver, shares);
        idleAssets += assets;

        _checkAndAutoRebalance();

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function mint(uint256 shares, address receiver) external override whenNotPaused returns (uint256 assets) {
        require(shares > 0, "SolCross: zero mint");
        assets = convertToAssets(shares);
        require(assets > 0, "SolCross: zero assets needed");

        require(underlyingAsset.transferFrom(msg.sender, address(this), assets), "SolCross: transferFrom failed");

        _mint(receiver, shares);
        idleAssets += assets;

        _checkAndAutoRebalance();

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    // --- Standard Dual-Lane Withdraw Entrypoints ---

    function withdraw(uint256 assets) external returns (uint256 shares) {
        return withdraw(assets, msg.sender, msg.sender);
    }

    function withdraw(uint256 assets, address receiver, address ownerAccount) public override returns (uint256 shares) {
        require(assets > 0, "SolCross: zero withdraw");
        require(receiver != address(0), "SolCross: zero receiver");

        shares = convertToShares(assets);
        require(shares > 0, "SolCross: zero shares");

        if (msg.sender != ownerAccount) {
            uint256 allowed = allowance[ownerAccount][msg.sender];
            if (allowed != type(uint256).max) {
                require(allowed >= shares, "SolCross: allowance exceeded");
                unchecked {
                    allowance[ownerAccount][msg.sender] = allowed - shares;
                }
            }
        }

        _burn(ownerAccount, shares);

        if (idleAssets < assets) {
            uint256 shortfall = assets - idleAssets;
            _unwindFromSolanaCPI(shortfall);
        }

        idleAssets -= assets;
        require(underlyingAsset.transfer(receiver, assets), "SolCross: transfer failed");

        emit Withdraw(msg.sender, receiver, ownerAccount, assets, shares);
    }

    function redeem(uint256 shares, address receiver, address ownerAccount) external override returns (uint256 assets) {
        require(shares > 0, "SolCross: zero shares");
        assets = convertToAssets(shares);
        require(assets > 0, "SolCross: zero assets");

        if (msg.sender != ownerAccount) {
            uint256 allowed = allowance[ownerAccount][msg.sender];
            if (allowed != type(uint256).max) {
                require(allowed >= shares, "SolCross: allowance exceeded");
                unchecked {
                    allowance[ownerAccount][msg.sender] = allowed - shares;
                }
            }
        }

        _burn(ownerAccount, shares);

        if (idleAssets < assets) {
            uint256 shortfall = assets - idleAssets;
            _unwindFromSolanaCPI(shortfall);
        }

        idleAssets -= assets;
        require(underlyingAsset.transfer(receiver, assets), "SolCross: transfer failed");

        emit Withdraw(msg.sender, receiver, ownerAccount, assets, shares);
    }

    // =========================================================================
    //            ROME ATOMIC CPI STRATEGY & REBALANCING ENGINE
    // =========================================================================

    function rebalance() external onlyManager {
        _executeRebalance();
    }

    function _checkAndAutoRebalance() internal {
        uint256 total = totalAssets();
        if (total == 0) return;

        uint256 targetSolana = (total * targetSolanaAllocationBps) / BPS_DENOMINATOR;
        if (targetSolana > solanaAllocatedAssets) {
            uint256 diff = targetSolana - solanaAllocatedAssets;
            if (diff >= 100 * 1e6 && idleAssets >= diff) {
                _deployToSolanaCPI(diff);
            }
        }
    }

    function _executeRebalance() internal {
        uint256 total = totalAssets();
        if (total == 0) return;

        uint256 targetSolana = (total * targetSolanaAllocationBps) / BPS_DENOMINATOR;

        if (targetSolana > solanaAllocatedAssets) {
            uint256 toDeploy = targetSolana - solanaAllocatedAssets;
            if (toDeploy > idleAssets) toDeploy = idleAssets;
            if (toDeploy > 0) {
                _deployToSolanaCPI(toDeploy);
            }
        } else if (solanaAllocatedAssets > targetSolana) {
            uint256 toUnwind = solanaAllocatedAssets - targetSolana;
            if (toUnwind > 0) {
                _unwindFromSolanaCPI(toUnwind);
            }
        }
    }

    function _deployToSolanaCPI(uint256 amount) internal {
        require(amount <= idleAssets, "SolCross: insufficient idle assets");

        if (solanaProgramId != bytes32(0)) {
            ICrossProgramInvocation.AccountMeta[] memory accounts = new ICrossProgramInvocation.AccountMeta[](3);
            bytes32 contractPda = HelperProgram.pda(address(this));
            accounts[0] = ICrossProgramInvocation.AccountMeta(contractPda, false, true);
            accounts[1] = ICrossProgramInvocation.AccountMeta(solanaMarketAccount, false, true);
            accounts[2] = ICrossProgramInvocation.AccountMeta(solanaReserveAta, false, true);

            bytes memory ixData = abi.encodePacked(uint8(1), _toLittleEndianU64(uint64(amount)));

            bytes32[] memory seeds = new bytes32[](0);
            CpiProgram.invoke_signed(solanaProgramId, accounts, ixData, seeds);
        }

        idleAssets -= amount;
        solanaAllocatedAssets += amount;

        emit StrategyRebalanced(idleAssets, solanaAllocatedAssets, amount, true);
    }

    function _unwindFromSolanaCPI(uint256 amount) internal {
        if (amount > solanaAllocatedAssets) {
            amount = solanaAllocatedAssets;
        }

        if (solanaProgramId != bytes32(0)) {
            ICrossProgramInvocation.AccountMeta[] memory accounts = new ICrossProgramInvocation.AccountMeta[](3);
            bytes32 contractPda = HelperProgram.pda(address(this));
            accounts[0] = ICrossProgramInvocation.AccountMeta(contractPda, false, true);
            accounts[1] = ICrossProgramInvocation.AccountMeta(solanaMarketAccount, false, true);
            accounts[2] = ICrossProgramInvocation.AccountMeta(solanaReserveAta, false, true);

            bytes memory ixData = abi.encodePacked(uint8(2), _toLittleEndianU64(uint64(amount)));

            bytes32[] memory seeds = new bytes32[](0);
            CpiProgram.invoke_signed(solanaProgramId, accounts, ixData, seeds);
        }

        solanaAllocatedAssets -= amount;
        idleAssets += amount;

        emit StrategyRebalanced(idleAssets, solanaAllocatedAssets, amount, false);
    }

    function harvestYield(uint256 earnedAmount) external onlyManager {
        require(earnedAmount > 0, "Zero yield");
        
        solanaAllocatedAssets += earnedAmount;
        totalYieldHarvested += earnedAmount;
        lastHarvestTimestamp = block.timestamp;

        emit YieldHarvested(earnedAmount, totalAssets(), block.timestamp);
    }

    event CrossActionExecuted(bytes32 indexed solanaProgram, address indexed caller, uint256 dataLength);

    /**
     * @notice Explicit atomic cross-runtime CPI action into any Solana program.
     * @dev Adheres strictly to Rome Protocol CPI primitives: explicit account metadata, Borsh/LE data, depth <= 4.
     */
    function executeCrossAction(
        bytes32 programId,
        bytes32 targetAccount,
        bytes calldata ixData
    ) external onlyManager {
        require(programId != bytes32(0), "Invalid program ID");
        ICrossProgramInvocation.AccountMeta[] memory accounts = new ICrossProgramInvocation.AccountMeta[](1);
        accounts[0] = ICrossProgramInvocation.AccountMeta(targetAccount, false, true);
        CpiProgram.invoke(programId, accounts, ixData);
        emit CrossActionExecuted(programId, msg.sender, ixData.length);
    }

    // =========================================================================
    //                        ADMIN & CIRCUIT BREAKER
    // =========================================================================

    function setStrategyParams(
        bytes32 _solanaProgramId,
        bytes32 _solanaMarketAccount,
        bytes32 _solanaReserveAta
    ) external onlyOwner {
        solanaProgramId = _solanaProgramId;
        solanaMarketAccount = _solanaMarketAccount;
        solanaReserveAta = _solanaReserveAta;
        emit StrategyUpdated(_solanaProgramId, _solanaMarketAccount, _solanaReserveAta);
    }

    function setAllocationTarget(uint256 _newBps) external onlyOwner {
        require(_newBps <= BPS_DENOMINATOR, "Max 100%");
        emit AllocationTargetUpdated(targetSolanaAllocationBps, _newBps);
        targetSolanaAllocationBps = _newBps;
    }

    function setApyEstimate(uint256 _apyBps) external onlyManager {
        currentApyBps = _apyBps;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    function emergencyRecall() external onlyOwner {
        paused = true;
        uint256 active = solanaAllocatedAssets;
        if (active > 0) {
            _unwindFromSolanaCPI(active);
        }
        emit EmergencyShutdown(active, block.timestamp);
    }

    // =========================================================================
    //                        INTERNAL HELPERS
    // =========================================================================

    function _toLittleEndianU64(uint64 v) internal pure returns (bytes memory) {
        bytes memory b = new bytes(8);
        for (uint256 i = 0; i < 8; i++) {
            b[i] = bytes1(uint8(v >> (i * 8)));
        }
        return b;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        require(balanceOf[from] >= amount, "SolCross: burn exceeds balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    // =========================================================================
    //                        ERC-20 METHODS
    // =========================================================================

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "SolCross: transfer exceeds balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "SolCross: allowance exceeded");
            unchecked {
                allowance[from][msg.sender] = allowed - amount;
            }
        }
        require(balanceOf[from] >= amount, "SolCross: transfer exceeds balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}
