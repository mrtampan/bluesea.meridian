/**
 * Test script for wallet APIs (all balance providers + token balance).
 * Prints the full raw return of every wallet function.
 * Run: node test/test-wallet.js
 */

import { loadEnv } from "../envcrypt.js";
import {
  getWalletBalances,
  getWalletBalancesFromBirdeye,
  getWalletBalancesFromAlchemy,
  getShyftTokenBalance,
} from "../tools/wallet.js";

loadEnv();

const SOL_MINT = "So11111111111111111111111111111111111111112";

function dump(label, data) {
  console.log(`\n─── ${label} ───`);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  console.log("=== Testing Wallet Tools ===\n");

  let walletAddress;
  const defaultBalances = await getWalletBalances();

  // 1. Default provider (config.walletApi / WALLET_API, default=helius)
  dump("getWalletBalances() — default provider", defaultBalances);

  walletAddress = defaultBalances?.wallet || null;
  if (walletAddress) {
    console.log(`\nWallet: ${walletAddress}`);
  } else {
    console.log("\nWallet not configured / balances returned null wallet");
  }

  // 2. Birdeye provider
  if (walletAddress) {
    dump("getWalletBalancesFromBirdeye()", await getWalletBalancesFromBirdeye(walletAddress));
  }

  // 3. Alchemy RPC provider
  if (walletAddress) {
    dump("getWalletBalancesFromAlchemy()", await getWalletBalancesFromAlchemy(walletAddress));
  }

  // 4. Per-token balance via Shyft
  if (walletAddress) {
    try {
      dump("getShyftTokenBalance(SOL)", await getShyftTokenBalance(walletAddress, SOL_MINT));
    } catch (err) {
      dump("getShyftTokenBalance(SOL)", { error: err.message });
    }
  }

  console.log("\n=== Wallet Tools Test Finished ===");
}

main().catch(console.error);