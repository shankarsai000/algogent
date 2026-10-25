import type { PaymentPlan } from "@algogent/shared";
import type { SettleContext, SettlementProvider, SettlementResult } from "../types";

/**
 * x402 USDC on Base (primary production rail).
 *
 * Flow (production):
 * 1. Build x402 payment requirements for developer + platform shares
 * 2. Client signs / facilitator settles USDC on Base
 * 3. Return payment ids / tx hashes
 *
 * This adapter encodes the protocol surface. Without a configured facilitator
 * URL or wallet signer it returns a structured failure (or simulate fallback).
 */
export const x402BaseAdapter: SettlementProvider = {
  rail: "x402_base",
  async settle(plan: PaymentPlan, ctx: SettleContext): Promise<SettlementResult> {
    if (plan.asset !== "USDC") {
      return {
        ok: false,
        rail: "x402_base",
        txIds: [],
        errorCode: "x402_base_requires_usdc",
      };
    }

    const facilitator = await readFacilitatorUrl("base");
    if (!facilitator) {
      if (ctx.allowSimulateFallback) {
        return {
          ok: true,
          rail: "simulate",
          txIds: [
            `x402-base-sim-dev-${plan.runId.slice(0, 8)}`,
            `x402-base-sim-plat-${plan.runId.slice(0, 8)}`,
          ],
          paymentId: `x402-base-sim-${plan.runId}`,
        };
      }
      return {
        ok: false,
        rail: "x402_base",
        txIds: [],
        errorCode: "x402_base_facilitator_not_configured",
      };
    }

    // Placeholder for live facilitator call (Coinbase CDP / custom).
    // POST facilitator with payment requirements for both split legs.
    try {
      const body = buildX402Payload(plan, "base");
      const res = await fetch(facilitator, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        return {
          ok: false,
          rail: "x402_base",
          txIds: [],
          errorCode: `x402_base_http_${res.status}`,
        };
      }
      const json = (await res.json()) as {
        paymentId?: string;
        txHashes?: string[];
      };
      return {
        ok: true,
        rail: "x402_base",
        txIds: json.txHashes ?? [],
        paymentId: json.paymentId,
      };
    } catch {
      return {
        ok: false,
        rail: "x402_base",
        txIds: [],
        errorCode: "x402_base_network_error",
      };
    }
  },
};

export function buildX402Payload(plan: PaymentPlan, chain: "base" | "solana") {
  return {
    protocol: "x402",
    chain,
    asset: "USDC",
    runId: plan.runId,
    skillId: plan.skillId,
    network: plan.network,
    splits: [
      {
        to: plan.developerPayTo,
        amountMicro: plan.developerMicro,
        role: "developer",
      },
      {
        to: plan.platformPayTo,
        amountMicro: plan.platformMicro,
        role: "platform",
      },
    ],
  };
}

async function readFacilitatorUrl(chain: "base" | "solana"): Promise<string | null> {
  try {
    const key = chain === "base" ? "x402BaseFacilitatorUrl" : "x402SolanaFacilitatorUrl";
    const data = await chrome.storage.local.get(key);
    const url = data[key];
    return typeof url === "string" && url.startsWith("http") ? url : null;
  } catch {
    return null;
  }
}
