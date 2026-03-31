/// <reference path="./globals.d.ts" />
import { SupraEVM, hexToBytecode } from './evm';

interface TestCase {
  name: string;
  run: () => boolean;
}

function expectStack(result: ReturnType<SupraEVM['execute']>, expected: bigint[]): boolean {
  return result.success && JSON.stringify(result.output.map(String)) === JSON.stringify(expected.map(String));
}

function printResult(name: string, success: boolean, details: string): boolean {
  console.log(`=== ${name} ===`);
  console.log(details);
  console.log(`Success: ${success}`);
  console.log('');
  return success;
}

const tests: TestCase[] = [
  {
    name: 'Test 1: PUSH1 5 + PUSH1 3',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600560030100')).execute();
      return printResult('Test 1', expectStack(result, [8n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [8]`);
    },
  },
  {
    name: 'Test 2: PUSH1 6 * PUSH1 7',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600660070200')).execute();
      return printResult('Test 2', expectStack(result, [42n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [42]`);
    },
  },
  {
    name: 'Test 3: PUSH1 10 - PUSH1 3',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600a60030300')).execute();
      return printResult('Test 3', expectStack(result, [7n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [7]`);
    },
  },
  {
    name: 'Test 4: SSTORE + SLOAD',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x604260015560015400')).execute();
      return printResult('Test 4', expectStack(result, [66n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [66]`);
    },
  },
  {
    name: 'Test 5: PUSH1 5 < PUSH1 10',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x6005600a1000')).execute();
      return printResult('Test 5', expectStack(result, [1n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [1]`);
    },
  },
  {
    name: 'Test 6: DUP + Stack ops',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600580800100')).execute();
      return printResult('Test 6', expectStack(result, [5n, 10n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [5, 10]`);
    },
  },
  {
    name: 'Test 7: (10 + 5) * 2',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600a60050160020200')).execute();
      return printResult('Test 7', expectStack(result, [30n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [30]`);
    },
  },
  {
    name: 'Test 8: DIV operation',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600a60020400')).execute();
      return printResult('Test 8', expectStack(result, [5n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [5]`);
    },
  },
  {
    name: 'Test 9: DIV by zero',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600a60000400')).execute();
      return printResult('Test 9', expectStack(result, [0n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [0]`);
    },
  },
  {
    name: 'Test 10: Unknown opcode error',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x6005aa00')).execute();
      const success = result.success === false && result.error?.includes('Unknown opcode') === true;
      return printResult('Test 10', success, `Error: ${result.error ?? 'none'} | Expected unknown opcode error`);
    },
  },
  {
    name: 'Test 11: MSTORE + MLOAD',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x602a60005260005100')).execute();
      return printResult('Test 11', expectStack(result, [42n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [42]`);
    },
  },
  {
    name: 'Test 12: AND (0xFF & 0x0F)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x60ff600f1600')).execute();
      return printResult('Test 12', expectStack(result, [15n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [15]`);
    },
  },
  {
    name: 'Test 13: OR (0xF0 | 0x0F)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x60f0600f1700')).execute();
      return printResult('Test 13', expectStack(result, [255n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [255]`);
    },
  },
  {
    name: 'Test 14: XOR (0xFF ^ 0x0F)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x60ff600f1800')).execute();
      return printResult('Test 14', expectStack(result, [240n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [240]`);
    },
  },
  {
    name: 'Test 15: ISZERO(0)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x60001500')).execute();
      return printResult('Test 15', expectStack(result, [1n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [1]`);
    },
  },
  {
    name: 'Test 16: SHL (1 << 2)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600160021b00')).execute();
      return printResult('Test 16', expectStack(result, [4n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [4]`);
    },
  },
  {
    name: 'Test 17: SHR (8 >> 2)',
    run: () => {
      const result = new SupraEVM(hexToBytecode('0x600860021c00')).execute();
      return printResult('Test 17', expectStack(result, [2n]), `Stack: ${JSON.stringify(result.output.map(String))} | Expected: [2]`);
    },
  },
];

console.log('🚀 Supra EVM - Test Suite');
console.log('');

let passed = 0;
for (const test of tests) {
  if (test.run()) {
    passed += 1;
  }
}

console.log('=== Summary ===');
console.log(`Tests passed: ${passed}/${tests.length}`);

if (passed !== tests.length) {
  process.exitCode = 1;
}
