// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    // Needed to calculate a safe amountOutMin before swapping.
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

contract AutoSwapperScript is Script {
    // Maximum slippage allowed, in basis points (100 = 1%).
    // Override with the SLIPPAGE_BPS env var. Defaults to 50 (0.5%).
    uint256 constant BPS_DENOMINATOR = 10_000;

    function run() external {
        // Fetch keys and token configuration from environment variables
        uint256 key1 = vm.envOr("KEY_1", uint256(0));
        uint256 key2 = vm.envOr("KEY_2", uint256(0));
        uint256 key3 = vm.envOr("KEY_3", uint256(0));

        address tokenA = vm.envOr("TOKEN_A", address(0));
        address tokenB = vm.envOr("TOKEN_B", address(0));

        // Router address with exact EIP-55 checksum: 0x77bF00A6A90c600f214b34BAFBB7918c0cF113A8
        address routerAddress = vm.envOr("ROUTER_ADDRESS", 0x77bF00A6A90c600f214b34BAFBB7918c0cF113A8);

        // Max allowed slippage in basis points. 50 = 0.5% tolerance.
        uint256 slippageBps = vm.envOr("SLIPPAGE_BPS", uint256(50));

        if (routerAddress == address(0)) {
            console.log("Error: Router address is address(0)");
            return;
        }

        if (tokenA == address(0) || tokenB == address(0)) {
            console.log("Error: TOKEN_A or TOKEN_B is not set in environment");
            return;
        }

        if (slippageBps == 0 || slippageBps > 1000) {
            // Sanity check: refuse to run with 0% tolerance (guaranteed revert
            // on any price movement) or more than 10% tolerance (way too loose).
            console.log("Error: SLIPPAGE_BPS must be between 1 and 1000");
            return;
        }

        IUniswapV2Router router = IUniswapV2Router(routerAddress);

        // Array of keys to process
        uint256[3] memory keys = [key1, key2, key3];

        for (uint256 i = 0; i < keys.length; i++) {
            uint256 key = keys[i];
            if (key == 0) continue;

            address swapperAddress = vm.addr(key);
            console.log("-----------------------------------------");
            console.log("Processing swap for address:", swapperAddress);

            uint256 balanceA = IERC20(tokenA).balanceOf(swapperAddress);
            console.log("Token A balance:", balanceA);

            if (balanceA == 0) {
                console.log("Skip: Zero balance for Token A");
                continue;
            }

            // Amount of Token A to swap (e.g. 1.2e7)
            uint256 amountIn = 1.2e7;
            if (balanceA < amountIn) {
                amountIn = balanceA;
            }

            address[] memory path = new address[](2);
            path[0] = tokenA;
            path[1] = tokenB;

            // --- Slippage protection ---
            // Ask the router what the current expected output is, then only
            // accept a swap that returns at least (100% - slippageBps) of it.
            // This is the fix for the previous amountOutMin = 0 bug, which
            // accepted ANY output amount and was exploitable via sandwich
            // attacks / MEV front-running.
            uint256[] memory expectedAmounts = router.getAmountsOut(amountIn, path);
            uint256 expectedOut = expectedAmounts[expectedAmounts.length - 1];

            if (expectedOut == 0) {
                console.log("Skip: router reports zero output for this path (no liquidity?)");
                continue;
            }

            uint256 amountOutMin = (expectedOut * (BPS_DENOMINATOR - slippageBps)) / BPS_DENOMINATOR;
            console.log("Expected output:", expectedOut);
            console.log("Minimum accepted output (with slippage guard):", amountOutMin);

            // Set a safe 20-minute deadline from current block
            uint256 deadline = block.timestamp + 1200;

            vm.startBroadcast(key);

            // Approve the Router to spend Token A
            IERC20(tokenA).approve(address(router), amountIn);

            // Execute the swap
            try router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                swapperAddress,
                deadline
            ) returns (uint256[] memory amounts) {
                console.log("Swap Succeeded! Tokens received:", amounts[1]);
            } catch Error(string memory reason) {
                console.log("Swap Failed with error reason:", reason);
            } catch {
                console.log("Swap Failed with direct low-level revert");
            }

            vm.stopBroadcast();
        }
    }
}
