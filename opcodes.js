export declare class EVMMemory {
    private data;
    private ensureSize;
    readByte(offset: number): number;
    writeByte(offset: number, value: number): void;
    readWord(offset: number): bigint;
    writeWord(offset: number, value: bigint): void;
    readSlice(offset: number, size: number): Uint8Array;
    toHex(limit?: number): string;
}
