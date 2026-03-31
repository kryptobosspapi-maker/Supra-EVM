"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMStack = exports.MAX_STACK_ITEMS = exports.TWO_255 = exports.TWO_256 = exports.WORD_BYTES = exports.WORD_BITS = void 0;
exports.normalizeWord = normalizeWord;
exports.toSigned = toSigned;
exports.fromSigned = fromSigned;
exports.WORD_BITS = 256n;
exports.WORD_BYTES = 32;
exports.TWO_256 = 1n << exports.WORD_BITS;
exports.TWO_255 = 1n << 255n;
exports.MAX_STACK_ITEMS = 1024;
function normalizeWord(value) {
    const mod = value % exports.TWO_256;
    return mod >= 0n ? mod : mod + exports.TWO_256;
}
function toSigned(value) {
    const normalized = normalizeWord(value);
    return normalized >= exports.TWO_255 ? normalized - exports.TWO_256 : normalized;
}
function fromSigned(value) {
    return normalizeWord(value);
}
class EVMStack {
    constructor() {
        this.items = [];
    }
    push(value) {
        if (this.items.length >= exports.MAX_STACK_ITEMS) {
            throw new Error('Stack overflow');
        }
        this.items.push(normalizeWord(value));
    }
    pop() {
        const value = this.items.pop();
        if (value === undefined) {
            throw new Error('Stack underflow');
        }
        return value;
    }
    peek(depth = 0) {
        const index = this.items.length - 1 - depth;
        if (index < 0) {
            throw new Error('Stack underflow');
        }
        return this.items[index];
    }
    dup(position) {
        if (position < 1 || position > 16) {
            throw new Error(`Invalid DUP position: ${position}`);
        }
        this.push(this.peek(position - 1));
    }
    swap(position) {
        if (position < 1 || position > 16) {
            throw new Error(`Invalid SWAP position: ${position}`);
        }
        const topIndex = this.items.length - 1;
        const otherIndex = this.items.length - 1 - position;
        if (otherIndex < 0) {
            throw new Error('Stack underflow');
        }
        [this.items[topIndex], this.items[otherIndex]] = [this.items[otherIndex], this.items[topIndex]];
    }
    clear() {
        this.items.length = 0;
    }
    size() {
        return this.items.length;
    }
    toArray() {
        return [...this.items];
    }
}
exports.EVMStack = EVMStack;
