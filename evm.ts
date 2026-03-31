import { EVMMemory } from './memory';
import { EVMStack, normalizeWord } from './stack';
import { ExecutionContext, OPCODES } from './opcodes';

export interface EVMState {
  pc: number;
  stack: bigint[];
  memory: string;
  storage: Map<string, bigint>;
  gasUsed: bigint;
  halted: boolean;
  returnData: Uint8Array<ArrayBufferLike>;
}

export interface ExecutionResult {
  success: boolean;
  output: bigint[];
  gasUsed: bigint;
  storage: Map<string, bigint>;
  returnData: Uint8Array<ArrayBufferLike>;
  error?: string;
}

export interface SupraEVMOptions {
  gasLimit?: bigint;
  maxSteps?: number;
}

function chunkBytesToWords(bytes: Uint8Array<ArrayBufferLike>): bigint[] {
  if (bytes.length === 0) {
    return [];
  }

  const output: bigint[] = [];
  for (let offset = 0; offset < bytes.length; offset += 32) {
    let word = 0n;
    const end = Math.min(offset + 32, bytes.length);
    for (let i = offset; i < end; i += 1) {
      word = (word << 8n) | BigInt(bytes[i]);
    }
    const missing = 32 - (end - offset);
    word <<= BigInt(missing * 8);
    output.push(normalizeWord(word));
  }
  return output;
}

export class SupraEVM {
  private readonly bytecode: Uint8Array<ArrayBufferLike>;
  private readonly gasLimit: bigint;
  private readonly maxSteps: number;

  private stack = new EVMStack();
  private memory = new EVMMemory();
  private storage = new Map<string, bigint>();
  private pc = 0;
  private gasUsed = 0n;
  private halted = false;
  private returnData: Uint8Array<ArrayBufferLike> = new Uint8Array(0);

  constructor(bytecode: Uint8Array<ArrayBufferLike>, options: SupraEVMOptions = {}) {
    this.bytecode = bytecode;
    this.gasLimit = options.gasLimit ?? 10_000_000n;
    this.maxSteps = options.maxSteps ?? 100_000;
  }

  execute(): ExecutionResult {
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
        const opcode = OPCODES[opcodeByte];
        if (!opcode) {
          throw new Error(`Unknown opcode: 0x${opcodeByte.toString(16).padStart(2, '0')}`);
        }

        this.gasUsed += opcode.gasCost;
        if (this.gasUsed > this.gasLimit) {
          throw new Error('Out of gas');
        }

        const ctx: ExecutionContext = {
          stack: this.stack,
          memory: this.memory,
          storage: this.storage,
          bytecode: this.bytecode,
          pc: currentPc,
          jump: (destination: number) => {
            this.pc = destination;
          },
          halt: () => {
            this.halted = true;
          },
          setReturnData: (data: Uint8Array<ArrayBufferLike>) => {
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
    } catch (error) {
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

  getState(): EVMState {
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

  reset(): void {
    this.stack = new EVMStack();
    this.memory = new EVMMemory();
    this.storage = new Map<string, bigint>();
    this.pc = 0;
    this.gasUsed = 0n;
    this.halted = false;
    this.returnData = new Uint8Array(0);
  }
}

export function hexToBytecode(hex: string): Uint8Array<ArrayBufferLike> {
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

export function bytecodeToHex(bytecode: Uint8Array<ArrayBufferLike>): string {
  return `0x${Array.from(bytecode)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}