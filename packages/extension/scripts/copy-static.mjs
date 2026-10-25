/**
 * Minimal static copy for Phase 0/1 until a full bundler (WXT) is wired.
 * Ensures manifest and side panel assets are listed for local load experiments.
 */
import { mkdir, copyFile, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, ".output");

await mkdir(out, { recursive: true });
await mkdir(join(out, "sidepanel"), { recursive: true });
await mkdir(join(out, "content"), { recursive: true });

await copyFile(join(root, "manifest.json"), join(out, "manifest.json"));
await copyFile(
  join(root, "sidepanel/styles.css"),
  join(out, "sidepanel/styles.css"),
);

// Side panel HTML points at built placeholders for now.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Algogent</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div id="root"></div>
  <p id="status" class="status"></p>
  <script src="./app.js" type="module"></script>
</body>
</html>
`;
await writeFile(join(out, "sidepanel/index.html"), html, "utf8");

const bg = await readFile(join(root, "src/background.ts"), "utf8");
await writeFile(
  join(out, "background.js"),
  `// Transpile step TBD — TypeScript source mirrored for structure.\n${bg}`,
  "utf8",
);

console.log("Static extension scaffold written to packages/extension/.output");
