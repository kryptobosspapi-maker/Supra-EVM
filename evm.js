import { EVMMemory } from './memory';
import { EVMStack } from './stack';
export interface Opcode {
    code: number;
    name: string;
    gasCost: bigint;
    description: string;
    handler: (ctx: ExecutionContext) => void;
}
export interface ExecutionContext {
    stack: EVMStack;
    memory: EVMMemory;
    storage: Map<string, bigint>;
    bytecode: Uint8Array;
    pc: number;
    jump: (destination: number) => void;
    halt: () => void;
    setReturnData: (data: Uint8Array) => void;
}
export declare const OPCODES: Record<number, Opcode>;
