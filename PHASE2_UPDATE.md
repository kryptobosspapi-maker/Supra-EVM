# Supra EVM - Phase 2 Update

## Summary

Phase 2 extends the original MVP into a broader proof of concept with **35+ implemented opcodes** and **17 passing tests**.

## New opcode groups added

### Memory
- `MLOAD` (`0x51`)
- `MSTORE` (`0x52`)
- `MSTORE8` (`0x53`)

### Bitwise
- `AND` (`0x16`)
- `OR` (`0x17`)
- `XOR` (`0x18`)
- `NOT` (`0x19`)
- `SHL` (`0x1b`)
- `SHR` (`0x1c`)
- `SAR` (`0x1d`)

### Signed comparisons and checks
- `SLT` (`0x12`)
- `SGT` (`0x13`)
- `ISZERO` (`0x15`)

## Existing functionality retained

- Arithmetic: `ADD`, `MUL`, `SUB`, `DIV`
- Comparison: `LT`, `GT`, `EQ`
- Stack: `POP`, `PUSH1-PUSH32`, `DUP1`, `SWAP1`
- Storage: `SLOAD`, `SSTORE`
- Control flow: `JUMP`, `JUMPI`, `JUMPDEST`, `STOP`, `RETURN`

## Test status

Documented Phase 2 result:

```text
Tests passed: 17/17
```

## Recommended Phase 3 directions

### Option A
Expand opcode coverage further.

### Option B
Run real Solidity contract bytecode against the interpreter.

### Option C
Prepare an integration layer for future Supra runtime work.
