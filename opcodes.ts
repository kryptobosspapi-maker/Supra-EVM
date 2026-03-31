export const WORD_BITS = 256n;
export const WORD_BYTES = 32;
export const TWO_256 = 1n << WORD_BITS;
export const TWO_255 = 1n << 255n;
export const MAX_STACK_ITEMS = 1024;

export function normalizeWord(value: bigint): bigint {
  const mod = value % TWO_256;
  return mod >= 0n ? mod : mod + TWO_256;
}

export function toSigned(value: bigint): bigint {
  const normalized = normalizeWord(value);
  return normalized >= TWO_255 ? normalized - TWO_256 : normalized;
}

export function fromSigned(value: bigint): bigint {
  return normalizeWord(value);
}

export class EVMStack {
  private readonly items: bigint[] = [];

  push(value: bigint): void {
    if (this.items.length >= MAX_STACK_ITEMS) {
      throw new Error('Stack overflow');
    }
    this.items.push(normalizeWord(value));
  }

  pop(): bigint {
    const value = this.items.pop();
    if (value === undefined) {
      throw new Error('Stack underflow');
    }
    return value;
  }

  peek(depth = 0): bigint {
    const index = this.items.length - 1 - depth;
    if (index < 0) {
      throw new Error('Stack underflow');
    }
    return this.items[index];
  }

  dup(position: number): void {
    if (position < 1 || position > 16) {
      throw new Error(`Invalid DUP position: ${position}`);
    }
    this.push(this.peek(position - 1));
  }

  swap(position: number): void {
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

  clear(): void {
    this.items.length = 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): bigint[] {
    return [...this.items];
  }
}
