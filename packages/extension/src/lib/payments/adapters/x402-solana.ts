import type { PaymentPlan } from "@algogent/shared";
import type { SettleContext, SettlementProvider, SettlementResult } from "../types";
import { buildX402Payload } from "./x402-base";

/** x402 USDC on Solana (optional high-throughput rail). */
export const x402SolanaAdapter: SettlementProvider = {
  rail: "x402_solana",
  async settle(plan: PaymentPlan, ctx: SettleContext): Promise<SettlementResult> {
    if (plan.asset !== "USDC") {
      return {
        ok: false,
        rail: "x402_solana",
        txIds: [],
        errorCode: "x402_solana_requires_usdc",
      };
    }

    const facilitator = await readFacilitatorUrl();
    if (!facilitator) {
      if (ctx.allowSimulateFallback) {
        return {
          ok: true,
          rail: "simulate",
          txIds: [
            `x402-sol-sim-dev-${plan.runId.slice(0, 8)}`,
            `x402-sol-sim-plat-${plan.runId.slice(0, 8)}`,
          ],
          paymentId: `x402-sol-sim-${plan.runId}`,
        };
      }
      return {
        ok: false,
        rail: "x402_solana",
        txIds: [],
        errorCode: "x402_solana_facilitator_not_configured",
      };
    }

    try {
      const res = await fetch(facilitator, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildX402Payload(plan, "solana")),
      });
      if (!res.ok) {
        return {
          ok: false,
          rail: "x402_solana",
          txIds: [],
          errorCode: `x402_solana_http_${res.status}`,
        };
      }
      const json = (await res.json()) as {
        paymentId?: string;
        txHashes?: string[];
      };
      return {
        ok: true,
        rail: "x402_solana",
        txIds: json.txHashes ?? [],
        paymentId: json.paymentId,
      };
    } catch {
      return {
        ok: false,
        rail: "x402_solana",
        txIds: [],
        errorCode: "x402_solana_network_error",
      };
    }
  },
};

async function readFacilitatorUrl(): Promise<string | null> {
  try {
    const data = await chrome.storage.local.get("x402SolanaFacilitatorUrl");
    const url = data.x402SolanaFacilitatorUrl;
    return typeof url === "string" && url.startsWith("http") ? url : null;
  } catch {
    return null;
  }
}
