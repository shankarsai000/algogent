import type { SkillResult, SkillRunRequest } from "@algogent/shared";
import {
  clickSend,
  injectPrompt,
  waitForCompletion,
} from "../lib/claude-adapter";

export default defineContentScript({
  matches: ["https://claude.ai/*"],
  runAt: "document_idle",
  main() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== "RUN_SKILL") return false;
      const request = message as SkillRunRequest;
      void executeRun(request).then(sendResponse);
      return true;
    });
  },
});

async function executeRun(request: SkillRunRequest): Promise<SkillResult> {
  try {
    await injectPrompt(request.renderedBody);
    await clickSend();
    const completed = await waitForCompletion({
      timeoutMs: 120_000,
      pollMs: 500,
    });
    if (!completed) {
      return {
        type: "SKILL_RESULT",
        runId: request.runId,
        status: "failed",
        errorCode: "completion_timeout",
      };
    }
    return {
      type: "SKILL_RESULT",
      runId: request.runId,
      status: "success",
      summary: "Claude run finished",
    };
  } catch (err) {
    return {
      type: "SKILL_RESULT",
      runId: request.runId,
      status: "failed",
      errorCode: err instanceof Error ? err.message : "inject_failed",
    };
  }
}
