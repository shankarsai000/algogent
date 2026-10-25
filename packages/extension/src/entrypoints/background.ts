import { detectProviderFromUrl } from "@algogent/shared";
import type { SkillResult, SkillRunRequest } from "@algogent/shared";

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel?.setPanelBehavior) {
      void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "GET_ACTIVE_PROVIDER") {
      void resolveActiveProvider().then(sendResponse);
      return true;
    }

    if (message?.type === "RUN_SKILL") {
      void routeRunSkill(message as SkillRunRequest).then(sendResponse);
      return true;
    }

    sendResponse({ ok: false, error: "unknown_message" });
    return true;
  });
});

async function resolveActiveProvider(): Promise<{
  ok: boolean;
  provider?: string;
  tabId?: number;
  error?: string;
}> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    return { ok: false, error: "no_active_tab" };
  }
  const provider = detectProviderFromUrl(tab.url);
  if (!provider) {
    return { ok: false, error: "unsupported_provider", tabId: tab.id };
  }
  return { ok: true, provider, tabId: tab.id };
}

async function routeRunSkill(
  request: SkillRunRequest,
): Promise<SkillResult | { type: "SKILL_RESULT"; runId: string; status: "failed"; errorCode: string }> {
  const active = await resolveActiveProvider();
  if (!active.ok || active.tabId == null) {
    return {
      type: "SKILL_RESULT",
      runId: request.runId,
      status: "failed",
      errorCode: active.error ?? "no_active_tab",
    };
  }

  if (active.provider !== request.provider) {
    return {
      type: "SKILL_RESULT",
      runId: request.runId,
      status: "failed",
      errorCode: `provider_mismatch:active=${active.provider},requested=${request.provider}`,
    };
  }

  try {
    const result = await chrome.tabs.sendMessage(active.tabId, request);
    return result as SkillResult;
  } catch {
    return {
      type: "SKILL_RESULT",
      runId: request.runId,
      status: "failed",
      errorCode: "content_script_unreachable",
    };
  }
}
