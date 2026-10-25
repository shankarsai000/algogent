/** Minimal ambient types so tsc succeeds before `wxt prepare` generates full types. */

declare function defineBackground(main: () => void): unknown;

declare function defineContentScript(options: {
  matches: string[];
  runAt?: "document_start" | "document_end" | "document_idle";
  main: () => void;
}): unknown;

declare module "wxt" {
  export function defineConfig(config: Record<string, unknown>): unknown;
}
