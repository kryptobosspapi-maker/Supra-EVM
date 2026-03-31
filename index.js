export interface EVMState {
    pc: number;
    stack: bigint[];
    memory: string;
    storage: Map<string, bigint>;
    gasUsed: bigint;
    halted: boolean;
    returnData: Uint8Array;
}
export interface ExecutionResult {
    success: boolean;
    output: bigint[];
    gasUsed: bigint;
    storage: Map<string, bigint>;
    returnData: Uint8Array;
    error?: string;
}
export interface SupraEVMOptions {
    gasLimit?: bigint;
    maxSteps?: number;
}
export declare class SupraEVM {
    private readonly bytecode;
    private readonly gasLimit;
    private readonly maxSteps;
    private stack;
    private memory;
    private storage;
    private pc;
    private gasUsed;
    private halted;
    private returnData;
    constructor(bytecode: Uint8Array, options?: SupraEVMOptions);
    execute(): ExecutionResult;
    getState(): EVMState;
    reset(): void;
}
export declare function hexToBytecode(hex: string): Uint8Array;
export declare function bytecodeToHex(bytecode: Uint8Array): string;
