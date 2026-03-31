"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupraEVM = void 0;
exports.hexToBytecode = hexToBytecode;
exports.bytecodeToHex = bytecodeToHex;
const memory_1 = require("./memory");
const stack_1 = require("./stack");
const opcodes_1 = require("./opcodes");
function chunkBytesToWords(bytes) {
    if (bytes.length === 0) {
        return [];
    }
    const output = [];
    for (let offset = 0; offset < bytes.length; offset += 32) {
        let word = 0n;
        const end = Math.min(offset + 32, bytes.length);
        for (let i = offset; i < end; i += 1) {
            word = (word << 8n) | BigInt(bytes[i]);
        }
        const missing = 32 - (end - offset);
        word <<= BigInt(missing * 8);
        output.push((0, stack_1.normalizeWord)(word));
    }
    return output;
}
class SupraEVM {
    constructor(bytecode, options = {}) {
        this.stack = new stack_1.EVMStack();
        this.memory = new memory_1.EVMMemory();
        this.storage = new Map();
        this.pc = 0;
        this.gasUsed = 0n;
        this.halted = false;
        this.returnData = new Uint8Array(0);
        this.bytecode = bytecode;
        this.gasLimit = options.gasLimit ?? 10000000n;
        this.maxSteps = options.maxSteps ?? 100000;
    }
    execute() {
        this.reset();
        try {
            let steps = 0;
            while (!this.halted && this.pc < this.bytecode.length) {
                if (steps >= this.maxSteps) {
                    throw new Error('Max steps exceeded');
                }
                steps += 1;
                const currentPc = this.pc;
                const opcodeByte = this.bytecode[this.pc];
                const opcode = opcodes_1.OPCODES[opcodeByte];
                if (!opcode) {
                    throw new Error(`Unknown opcode: 0x${opcodeByte.toString(16).padStart(2, '0')}`);
                }
                this.gasUsed += opcode.gasCost;
                if (this.gasUsed > this.gasLimit) {
                    throw new Error('Out of gas');
                }
                const ctx = {
                    stack: this.stack,
                    memory: this.memory,
                    storage: this.storage,
                    bytecode: this.bytecode,
                    pc: currentPc,
                    jump: (destination) => {
                        this.pc = destination;
                    },
                    halt: () => {
                        this.halted = true;
                    },
                    setReturnData: (data) => {
                        this.returnData = data;
                    },
                };
                opcode.handler(ctx);
                if (!this.halted && this.pc === currentPc) {
                    this.pc += 1;
                }
            }
            return {
                success: true,
                output: this.returnData.length > 0 ? chunkBytesToWords(this.returnData) : this.stack.toArray(),
                gasUsed: this.gasUsed,
                storage: new Map(this.storage),
                returnData: this.returnData.slice(),
            };
        }
        catch (error) {
            return {
                success: false,
                output: this.stack.toArray(),
                gasUsed: this.gasUsed,
                storage: new Map(this.storage),
                returnData: this.returnData.slice(),
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    getState() {
        return {
            pc: this.pc,
            stack: this.stack.toArray(),
            memory: this.memory.toHex(),
            storage: new Map(this.storage),
            gasUsed: this.gasUsed,
            halted: this.halted,
            returnData: this.returnData.slice(),
        };
    }
    reset() {
        this.stack = new stack_1.EVMStack();
        this.memory = new memory_1.EVMMemory();
        this.storage = new Map();
        this.pc = 0;
        this.gasUsed = 0n;
        this.halted = false;
        this.returnData = new Uint8Array(0);
    }
}
exports.SupraEVM = SupraEVM;
function hexToBytecode(hex) {
    const normalized = hex.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
    if (normalized.length % 2 !== 0) {
        throw new Error('Hex string must have an even number of characters');
    }
    const bytes = new Uint8Array(normalized.length / 2);
    for (let i = 0; i < normalized.length; i += 2) {
        bytes[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
    }
    return bytes;
}
function bytecodeToHex(bytecode) {
    return `0x${Array.from(bytecode)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')}`;
}
