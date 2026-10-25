import { z } from "zod";

export const AiProviderSchema = z.enum([
  "chatgpt",
  "claude",
  "gemini",
  "meta_ai",
]);

export type AiProvider = z.infer<typeof AiProviderSchema>;

/** Host patterns used to detect the active provider from a tab URL. */
export const PROVIDER_HOST_PATTERNS: Record<AiProvider, RegExp[]> = {
  chatgpt: [/chatgpt\.com$/i, /chat\.openai\.com$/i],
  claude: [/claude\.ai$/i],
  gemini: [/gemini\.google\.com$/i],
  meta_ai: [/meta\.ai$/i, /www\.meta\.ai$/i],
};

export function detectProviderFromUrl(url: string): AiProvider | null {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return null;
  }

  for (const [provider, patterns] of Object.entries(PROVIDER_HOST_PATTERNS) as [
    AiProvider,
    RegExp[],
  ][]) {
    if (patterns.some((re) => re.test(hostname))) {
      return provider;
    }
  }
  return null;
}
