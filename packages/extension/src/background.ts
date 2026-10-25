/**
 * Service worker: opens side panel and relays typed messages.
 * Payment orchestration lands in Phase 3.
 */

chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel?.setPanelBehavior) {
    void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Pass-through for Phase 1; validation via shared schemas in later slices.
  if (message && typeof message === "object" && "type" in message) {
    sendResponse({ ok: true, echo: message });
    return true;
  }
  sendResponse({ ok: false, error: "invalid_message" });
  return true;
});
