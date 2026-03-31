export declare const WORD_BITS = 256n;
export declare const WORD_BYTES = 32;
export declare const TWO_256: bigint;
export declare const TWO_255: bigint;
export declare const MAX_STACK_ITEMS = 1024;
export declare function normalizeWord(value: bigint): bigint;
export declare function toSigned(value: bigint): bigint;
export declare function fromSigned(value: bigint): bigint;
export declare class EVMStack {
    private readonly items;
    push(value: bigint): void;
    pop(): bigint;
    peek(depth?: number): bigint;
    dup(position: number): void;
    swap(position: number): void;
    clear(): void;
    size(): number;
    toArray(): bigint[];
}
