import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore
import solc from "solc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function findImports(path: string) {
  try {
    let resolvedPath: string;
    if (path.startsWith("../")) {
      resolvedPath = resolve(root, "contracts", path.replace(/^\.\.\//, ""));
    } else if (path.startsWith("./")) {
      resolvedPath = resolve(root, "contracts/core", path.replace(/^\.\//, ""));
    } else {
      resolvedPath = resolve(root, "contracts", path);
    }
    return { contents: readFileSync(resolvedPath, "utf8") };
  } catch (err: any) {
    return { error: `File not found: ${path} (${err.message})` };
  }
}

export function compileVault() {
  const vaultPath = resolve(root, "contracts/core/SolCrossVault.sol");
  const source = readFileSync(vaultPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "SolCrossVault.sol": { content: source },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
        },
      },
    },
  };

  console.log("Compiling SolCrossVault.sol with solc...");
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (output.errors) {
    const errors = output.errors.filter((e: any) => e.severity === "error");
    if (errors.length > 0) {
      console.error("Solidity compilation errors:", JSON.stringify(errors, null, 2));
      throw new Error(`Solidity compilation failed with ${errors.length} errors`);
    }
  }

  const contract = output.contracts["SolCrossVault.sol"].SolCrossVault;
  const abi = contract.abi;
  const bytecode = `0x${contract.evm.bytecode.object}` as `0x${string}`;

  mkdirSync(resolve(root, "artifacts"), { recursive: true });
  writeFileSync(
    resolve(root, "artifacts/SolCrossVault.json"),
    JSON.stringify({ abi, bytecode }, null, 2),
    "utf8"
  );

  console.log("Compilation successful! Artifact saved to artifacts/SolCrossVault.json");
  return { abi, bytecode };
}

compileVault();
