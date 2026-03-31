<<<<<<< HEAD
# Supra EVM - Ethereum Virtual Machine for Supra Blockchain

A lightweight, TypeScript-based EVM interpreter designed as a proof of concept for EVM compatibility on Supra.

## Current Status

This repository is documented as a **Phase 2 MVP** with:

- **35+ implemented opcodes**
- **17 passing tests**
- Core stack, memory, storage, control flow, and arithmetic support
- A clean base for extending toward fuller EVM coverage

> Note: this bundle contains the corrected root project files that were uploaded in chat. Before publishing publicly, make sure your `src/` directory is present in the repository.

## Project Structure

```text
src/
├── stack.ts
├── memory.ts
├── opcodes.ts
├── evm.ts
├── index.ts
└── test.ts
```

## Features

### Implemented Categories

- Arithmetic: `ADD`, `MUL`, `SUB`, `DIV`
- Comparison: `LT`, `GT`, `EQ`, `SLT`, `SGT`, `ISZERO`
- Stack: `PUSH1-PUSH32`, `POP`, `DUP1`, `SWAP1`
- Memory: `MLOAD`, `MSTORE`, `MSTORE8`
- Storage: `SLOAD`, `SSTORE`
- Bitwise: `AND`, `OR`, `XOR`, `NOT`, `SHL`, `SHR`, `SAR`
- Control flow: `JUMP`, `JUMPI`, `JUMPDEST`, `STOP`, `RETURN`

## Quick Start

```bash
npm install
npm test
npm run build
```

## Development Scripts

```bash
npm run dev
npm test
npm run build
npm run clean
```

## Why this PoC matters

- Demonstrates technical feasibility for EVM execution on Supra
- Provides a modular architecture for further opcode coverage
- Establishes a foundation for future Solidity compatibility work

## Recommended Next Steps

1. Add the full `src/` directory
2. Run `npm install`
3. Run `npm test`
4. Run `npm run build`
5. Publish the repository once the build and tests pass locally

## License

MIT
=======
# Supra-EVM
Proof-of-concept EVM compatibility layer for Supra Blockchain, built in TypeScript.
>>>>>>> e660d1d50453df9c6cae8b5b5d009c6c4ab5db51
