# Supra EVM - Quick Start Guide

## 1. Clone the repository

```bash
git clone https://github.com/kryptobosspapi-maker/supra-evm.git
cd supra-evm
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run the test suite

```bash
npm test
```

Expected outcome for the documented Phase 2 state:

```text
Tests passed: 17/17
```

## 4. Build for production

```bash
npm run build
```

This creates a `dist/` directory with compiled JavaScript.

## Minimal usage example

Create `example.ts`:

```typescript
import { SupraEVM, hexToBytecode } from "./src/evm";

const bytecode = hexToBytecode("0x6005 6003 01 00");
const evm = new SupraEVM(bytecode);
const result = evm.execute();

console.log("Result:", result.output[0].toString());
console.log("Gas used:", result.gasUsed.toString());
```

Run it:

```bash
npx ts-node example.ts
```

## Troubleshooting

### PowerShell execution policy issue

If PowerShell blocks npm scripts, use:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then rerun:

```bash
npm test
```

### Missing source files

If `src/` is not present, restore it before building or publishing.
