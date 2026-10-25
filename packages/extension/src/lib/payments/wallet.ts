/**
 * Minimal wallet surface for Phase 3.
 * Prefer ARC-0027 `window.algorand` when present; otherwise simulate mode.
 */

export type WalletAccount = {
  address: string;
  name?: string;
};

export type SignedTxBlob = {
  /** Base64-encoded signed transaction */
  blob: string;
};

declare global {
  interface Window {
    algorand?: {
      enable: (opts?: {
        genesisID?: string;
      }) => Promise<{ accounts: string[] }>;
      signTxns?: (
        txns: Array<{ txn: string }>,
      ) => Promise<Array<string | null>>;
    };
  }
}

export async function connectWallet(): Promise<WalletAccount> {
  if (typeof window !== "undefined" && window.algorand?.enable) {
    const res = await window.algorand.enable({
      genesisID: "testnet-v1.0",
    });
    const address = res.accounts[0];
    if (!address) throw new Error("wallet_no_accounts");
    await chrome.storage.local.set({ walletAddress: address });
    return { address };
  }
  // Simulate identity for local/dev without a wallet extension.
  const simulated = "SIMULATEDWALLETADDRESSFORLOCALDEVONLY000000000000";
  await chrome.storage.local.set({ walletAddress: simulated, paymentSimulate: true });
  return { address: simulated, name: "simulate" };
}

export async function getStoredWalletAddress(): Promise<string | null> {
  const { walletAddress } = await chrome.storage.local.get("walletAddress");
  return typeof walletAddress === "string" ? walletAddress : null;
}

export async function disconnectWallet(): Promise<void> {
  await chrome.storage.local.remove("walletAddress");
}
