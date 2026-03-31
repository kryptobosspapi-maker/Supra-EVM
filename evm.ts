import { WORD_BYTES, normalizeWord } from './stack';

export class EVMMemory {
  private data = new Uint8Array(0);

  private ensureSize(size: number): void {
    if (size <= this.data.length) {
      return;
    }

    let nextLength = this.data.length === 0 ? 32 : this.data.length;
    while (nextLength < size) {
      nextLength *= 2;
    }

    const next = new Uint8Array(nextLength);
    next.set(this.data);
    this.data = next;
  }

  readByte(offset: number): number {
    if (offset < 0) {
      throw new Error('Negative memory offset');
    }
    return offset < this.data.length ? this.data[offset] : 0;
  }

  writeByte(offset: number, value: number): void {
    if (offset < 0) {
      throw new Error('Negative memory offset');
    }
    this.ensureSize(offset + 1);
    this.data[offset] = value & 0xff;
  }

  readWord(offset: number): bigint {
    if (offset < 0) {
      throw new Error('Negative memory offset');
    }

    let result = 0n;
    for (let i = 0; i < WORD_BYTES; i += 1) {
      result = (result << 8n) | BigInt(this.readByte(offset + i));
    }
    return normalizeWord(result);
  }

  writeWord(offset: number, value: bigint): void {
    if (offset < 0) {
      throw new Error('Negative memory offset');
    }

    this.ensureSize(offset + WORD_BYTES);
    let remaining = normalizeWord(value);
    for (let i = WORD_BYTES - 1; i >= 0; i -= 1) {
      this.data[offset + i] = Number(remaining & 0xffn);
      remaining >>= 8n;
    }
  }

  readSlice(offset: number, size: number): Uint8Array {
    if (offset < 0 || size < 0) {
      throw new Error('Negative memory offset or size');
    }
    const out = new Uint8Array(size);
    for (let i = 0; i < size; i += 1) {
      out[i] = this.readByte(offset + i);
    }
    return out;
  }

  toHex(limit = 256): string {
    const visible = this.data.slice(0, Math.min(limit, this.data.length));
    return Array.from(visible)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
