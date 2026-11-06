import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const artifactPath = resolve(__dirname, '../artifacts/SolCrossVault.json');
const outPath = resolve(__dirname, '../frontend/src/lib/vaultContractData.ts');

const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

const content = `// Auto-generated SolCrossVault ABI and Bytecode for in-browser deployment
export const VAULT_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;

export const VAULT_BYTECODE = "${artifact.bytecode}" as \`0x\${string}\`;
`;

writeFileSync(outPath, content, 'utf8');
console.log('Successfully generated frontend/src/lib/vaultContractData.ts');
