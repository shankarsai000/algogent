import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  modules: [],
  manifest: {
    name: "Algogent",
    description:
      "Marketplace for AI agent skills across ChatGPT, Claude, Gemini, and Meta AI. Pay per completed run on Algorand.",
    version: "0.1.0",
    permissions: ["sidePanel", "storage", "activeTab", "scripting", "tabs"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://chat.openai.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "https://www.meta.ai/*",
      "https://meta.ai/*",
    ],
    action: {
      default_title: "Algogent",
    },
  },
});
