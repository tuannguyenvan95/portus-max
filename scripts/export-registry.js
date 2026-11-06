// Generates browser-safe registry constants directly from @rome-protocol/registry
import { getChain, getTokens } from "@rome-protocol/registry";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../frontend/src/lib/registryData.ts");

const hadrian = getChain(200010);
const hadrianTokens = getTokens(200010);
const rubicon = getChain(7531);
const rubiconTokens = getTokens(7531);

const content = `// Auto-generated from official @rome-protocol/registry (canonical source of truth)
export const HADRIAN_REGISTRY = ${JSON.stringify(hadrian, null, 2)} as const;
export const HADRIAN_TOKENS = ${JSON.stringify(hadrianTokens, null, 2)} as const;

export const RUBICON_REGISTRY = ${JSON.stringify(rubicon, null, 2)} as const;
export const RUBICON_TOKENS = ${JSON.stringify(rubiconTokens, null, 2)} as const;
`;

writeFileSync(outFile, content, "utf8");
console.log("Successfully generated frontend/src/lib/registryData.ts from @rome-protocol/registry");
