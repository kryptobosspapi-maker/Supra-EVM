"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCODES = void 0;
const stack_1 = require("./stack");
function storageKey(value) {
    return `0x${(0, stack_1.normalizeWord)(value).toString(16).padStart(64, '0')}`;
}
function toSafeNumber(value, label) {
    if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error(`${label} exceeds safe JavaScript range`);
    }
    return Number(value);
}
function validateJumpDestination(bytecode, destination) {
    if (destination < 0 || destination >= bytecode.length) {
        throw new Error(`Invalid jump destination: ${destination}`);
    }
    if (bytecode[destination] !== 0x5b) {
        throw new Error(`Jump destination is not a JUMPDEST: ${destination}`);
    }
}
const STOP = {
    code: 0x00,
    name: 'STOP',
    gasCost: 0n,
    description: 'Halt execution',
    handler: (ctx) => ctx.halt(),
};
const ADD = {
    code: 0x01,
    name: 'ADD',
    gasCost: 3n,
    description: 'Addition',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a + b);
    },
};
const MUL = {
    code: 0x02,
    name: 'MUL',
    gasCost: 5n,
    description: 'Multiplication',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a * b);
    },
};
const SUB = {
    code: 0x03,
    name: 'SUB',
    gasCost: 3n,
    description: 'Subtraction',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(b - a);
    },
};
const DIV = {
    code: 0x04,
    name: 'DIV',
    gasCost: 5n,
    description: 'Unsigned division',
    handler: (ctx) => {
        const divisor = ctx.stack.pop();
        const dividend = ctx.stack.pop();
        ctx.stack.push(divisor === 0n ? 0n : dividend / divisor);
    },
};
const LT = {
    code: 0x10,
    name: 'LT',
    gasCost: 3n,
    description: 'Unsigned less-than',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(b < a ? 1n : 0n);
    },
};
const GT = {
    code: 0x11,
    name: 'GT',
    gasCost: 3n,
    description: 'Unsigned greater-than',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(b > a ? 1n : 0n);
    },
};
const SLT = {
    code: 0x12,
    name: 'SLT',
    gasCost: 3n,
    description: 'Signed less-than',
    handler: (ctx) => {
        const a = (0, stack_1.toSigned)(ctx.stack.pop());
        const b = (0, stack_1.toSigned)(ctx.stack.pop());
        ctx.stack.push(b < a ? 1n : 0n);
    },
};
const SGT = {
    code: 0x13,
    name: 'SGT',
    gasCost: 3n,
    description: 'Signed greater-than',
    handler: (ctx) => {
        const a = (0, stack_1.toSigned)(ctx.stack.pop());
        const b = (0, stack_1.toSigned)(ctx.stack.pop());
        ctx.stack.push(b > a ? 1n : 0n);
    },
};
const EQ = {
    code: 0x14,
    name: 'EQ',
    gasCost: 3n,
    description: 'Equality',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a === b ? 1n : 0n);
    },
};
const ISZERO = {
    code: 0x15,
    name: 'ISZERO',
    gasCost: 3n,
    description: 'Is zero',
    handler: (ctx) => {
        const value = ctx.stack.pop();
        ctx.stack.push(value === 0n ? 1n : 0n);
    },
};
const AND = {
    code: 0x16,
    name: 'AND',
    gasCost: 3n,
    description: 'Bitwise AND',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a & b);
    },
};
const OR = {
    code: 0x17,
    name: 'OR',
    gasCost: 3n,
    description: 'Bitwise OR',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a | b);
    },
};
const XOR = {
    code: 0x18,
    name: 'XOR',
    gasCost: 3n,
    description: 'Bitwise XOR',
    handler: (ctx) => {
        const a = ctx.stack.pop();
        const b = ctx.stack.pop();
        ctx.stack.push(a ^ b);
    },
};
const NOT = {
    code: 0x19,
    name: 'NOT',
    gasCost: 3n,
    description: 'Bitwise NOT',
    handler: (ctx) => {
        const value = ctx.stack.pop();
        ctx.stack.push((stack_1.TWO_256 - 1n) ^ value);
    },
};
const SHL = {
    code: 0x1b,
    name: 'SHL',
    gasCost: 3n,
    description: 'Logical shift left',
    handler: (ctx) => {
        const shift = ctx.stack.pop();
        const value = ctx.stack.pop();
        if (shift >= 256n) {
            ctx.stack.push(0n);
            return;
        }
        ctx.stack.push((0, stack_1.normalizeWord)(value << shift));
    },
};
const SHR = {
    code: 0x1c,
    name: 'SHR',
    gasCost: 3n,
    description: 'Logical shift right',
    handler: (ctx) => {
        const shift = ctx.stack.pop();
        const value = ctx.stack.pop();
        if (shift >= 256n) {
            ctx.stack.push(0n);
            return;
        }
        ctx.stack.push(value >> shift);
    },
};
const SAR = {
    code: 0x1d,
    name: 'SAR',
    gasCost: 3n,
    description: 'Arithmetic shift right',
    handler: (ctx) => {
        const shift = ctx.stack.pop();
        const value = (0, stack_1.toSigned)(ctx.stack.pop());
        if (shift >= 256n) {
            ctx.stack.push(value < 0n ? stack_1.TWO_256 - 1n : 0n);
            return;
        }
        ctx.stack.push((0, stack_1.fromSigned)(value >> shift));
    },
};
const POP = {
    code: 0x50,
    name: 'POP',
    gasCost: 2n,
    description: 'Discard top stack item',
    handler: (ctx) => {
        ctx.stack.pop();
    },
};
const MLOAD = {
    code: 0x51,
    name: 'MLOAD',
    gasCost: 3n,
    description: 'Load 32 bytes from memory',
    handler: (ctx) => {
        const offset = toSafeNumber(ctx.stack.pop(), 'Memory offset');
        ctx.stack.push(ctx.memory.readWord(offset));
    },
};
const MSTORE = {
    code: 0x52,
    name: 'MSTORE',
    gasCost: 3n,
    description: 'Store 32 bytes to memory',
    handler: (ctx) => {
        const offset = toSafeNumber(ctx.stack.pop(), 'Memory offset');
        const value = ctx.stack.pop();
        ctx.memory.writeWord(offset, value);
    },
};
const MSTORE8 = {
    code: 0x53,
    name: 'MSTORE8',
    gasCost: 3n,
    description: 'Store one byte to memory',
    handler: (ctx) => {
        const offset = toSafeNumber(ctx.stack.pop(), 'Memory offset');
        const value = ctx.stack.pop();
        ctx.memory.writeByte(offset, Number(value & 0xffn));
    },
};
const SLOAD = {
    code: 0x54,
    name: 'SLOAD',
    gasCost: 100n,
    description: 'Load from storage',
    handler: (ctx) => {
        const slot = ctx.stack.pop();
        ctx.stack.push(ctx.storage.get(storageKey(slot)) ?? 0n);
    },
};
const SSTORE = {
    code: 0x55,
    name: 'SSTORE',
    gasCost: 100n,
    description: 'Store to storage',
    handler: (ctx) => {
        const slot = ctx.stack.pop();
        const value = ctx.stack.pop();
        ctx.storage.set(storageKey(slot), (0, stack_1.normalizeWord)(value));
    },
};
const JUMP = {
    code: 0x56,
    name: 'JUMP',
    gasCost: 8n,
    description: 'Unconditional jump',
    handler: (ctx) => {
        const destination = toSafeNumber(ctx.stack.pop(), 'Jump destination');
        validateJumpDestination(ctx.bytecode, destination);
        ctx.jump(destination);
    },
};
const JUMPI = {
    code: 0x57,
    name: 'JUMPI',
    gasCost: 10n,
    description: 'Conditional jump',
    handler: (ctx) => {
        const destination = toSafeNumber(ctx.stack.pop(), 'Jump destination');
        const condition = ctx.stack.pop();
        if (condition !== 0n) {
            validateJumpDestination(ctx.bytecode, destination);
            ctx.jump(destination);
        }
    },
};
const JUMPDEST = {
    code: 0x5b,
    name: 'JUMPDEST',
    gasCost: 1n,
    description: 'Valid jump destination marker',
    handler: () => {
        // No-op.
    },
};
const RETURN = {
    code: 0xf3,
    name: 'RETURN',
    gasCost: 0n,
    description: 'Return memory slice and halt',
    handler: (ctx) => {
        const offset = toSafeNumber(ctx.stack.pop(), 'Return offset');
        const size = toSafeNumber(ctx.stack.pop(), 'Return size');
        ctx.setReturnData(ctx.memory.readSlice(offset, size));
        ctx.halt();
    },
};
exports.OPCODES = {
    0x00: STOP,
    0x01: ADD,
    0x02: MUL,
    0x03: SUB,
    0x04: DIV,
    0x10: LT,
    0x11: GT,
    0x12: SLT,
    0x13: SGT,
    0x14: EQ,
    0x15: ISZERO,
    0x16: AND,
    0x17: OR,
    0x18: XOR,
    0x19: NOT,
    0x1b: SHL,
    0x1c: SHR,
    0x1d: SAR,
    0x50: POP,
    0x51: MLOAD,
    0x52: MSTORE,
    0x53: MSTORE8,
    0x54: SLOAD,
    0x55: SSTORE,
    0x56: JUMP,
    0x57: JUMPI,
    0x5b: JUMPDEST,
    0xf3: RETURN,
};
for (let i = 0; i < 32; i += 1) {
    const code = 0x60 + i;
    const bytesToRead = i + 1;
    exports.OPCODES[code] = {
        code,
        name: `PUSH${bytesToRead}`,
        gasCost: 3n,
        description: `Push ${bytesToRead} bytes onto the stack`,
        handler: (ctx) => {
            let value = 0n;
            for (let j = 0; j < bytesToRead; j += 1) {
                const index = ctx.pc + 1 + j;
                if (index >= ctx.bytecode.length) {
                    throw new Error(`PUSH${bytesToRead} exceeds bytecode length`);
                }
                value = (value << 8n) | BigInt(ctx.bytecode[index]);
            }
            ctx.stack.push(value);
            ctx.jump(ctx.pc + bytesToRead + 1);
        },
    };
}
for (let i = 0; i < 16; i += 1) {
    const position = i + 1;
    const code = 0x80 + i;
    exports.OPCODES[code] = {
        code,
        name: `DUP${position}`,
        gasCost: 3n,
        description: `Duplicate stack item ${position}`,
        handler: (ctx) => {
            ctx.stack.dup(position);
        },
    };
}
for (let i = 0; i < 16; i += 1) {
    const position = i + 1;
    const code = 0x90 + i;
    exports.OPCODES[code] = {
        code,
        name: `SWAP${position}`,
        gasCost: 3n,
        description: `Swap top stack item with item ${position + 1}`,
        handler: (ctx) => {
            ctx.stack.swap(position);
        },
    };
}
