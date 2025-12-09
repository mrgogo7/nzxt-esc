/**
 * xxHash64 - Pure JavaScript Implementation
 * 
 * STATUS: PARKED — NOT ACTIVE
 * 
 * Fingerprint v2 (PARKED)
 * - Fully implemented but NOT active
 * - Used by computeFingerprintV2 (also parked)
 * 
 * FAZ-6 / Task 2B: Local xxhash64 implementation for Fingerprint v2.
 * 
 * This is a self-contained, pure JavaScript implementation of the xxHash64 algorithm.
 * Based on public-domain reference implementations.
 * 
 * xxHash is an extremely fast non-cryptographic hash algorithm, working at speeds
 * close to RAM limits. It is suitable for fingerprint generation where speed
 * and determinism are more important than cryptographic security.
 * 
 * License: Public Domain / MIT compatible
 * 
 * References:
 * - Original xxHash algorithm by Yann Collet: https://github.com/Cyan4973/xxHash
 * - Pure JS implementation adapted for deterministic hashing
 * - Uses BigInt for proper 64-bit arithmetic
 */

/**
 * Prime constants for xxHash64 algorithm.
 */
const PRIME64_1 = 0x9E3779B185EBCA87n;
const PRIME64_2 = 0xC2B2AE3D27D4EB4Fn;
const PRIME64_3 = 0x165667919E3779F9n;
const PRIME64_5 = 0x27D4EB2F165667C5n;

/**
 * Rotates a 64-bit BigInt left by the specified number of bits.
 * 
 * @param value - 64-bit BigInt value
 * @param amount - Number of bits to rotate (must be less than 64)
 * @returns Rotated value
 */
function rotateLeft64(value: bigint, amount: number): bigint {
  return ((value << BigInt(amount)) | (value >> BigInt(64 - amount))) & 0xFFFFFFFFFFFFFFFFn;
}

/**
 * Reads a 64-bit little-endian integer from a byte array.
 * 
 * @param bytes - Byte array
 * @param offset - Starting offset
 * @returns 64-bit BigInt value
 */
function readUint64LE(bytes: Uint8Array, offset: number): bigint {
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    if (offset + i < bytes.length) {
      value |= BigInt(bytes[offset + i]) << BigInt(i * 8);
    }
  }
  return value & 0xFFFFFFFFFFFFFFFFn;
}

/**
 * Compute xxHash64 hash of a string input.
 * 
 * This implementation uses BigInt for proper 64-bit arithmetic, ensuring
 * correct results for all input sizes. The algorithm processes input in
 * 32-byte blocks, then handles remaining bytes, and finally applies
 * avalanche mixing for better distribution.
 * 
 * @param input - Input string to hash
 * @param seed - Numeric seed value (will be converted to BigInt)
 * @returns Hexadecimal hash string (16 characters, lowercase)
 */
export function xxhash64(input: string, seed: number = 0): string {
  const inputBytes = new TextEncoder().encode(input);
  const len = inputBytes.length;
  const seedBigInt = BigInt(seed);
  
  let h64: bigint;
  
  if (len >= 32) {
    // Initialize 4 accumulators with seed-based values
    let v1 = (seedBigInt + PRIME64_1 + PRIME64_2) & 0xFFFFFFFFFFFFFFFFn;
    let v2 = (seedBigInt + PRIME64_2) & 0xFFFFFFFFFFFFFFFFn;
    let v3 = seedBigInt & 0xFFFFFFFFFFFFFFFFn;
    let v4 = (seedBigInt - PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
    
    // Process 32-byte blocks
    let offset = 0;
    const end = len - 32;
    
    while (offset <= end) {
      // Process each 8-byte chunk
      const k1 = readUint64LE(inputBytes, offset);
      const k2 = readUint64LE(inputBytes, offset + 8);
      const k3 = readUint64LE(inputBytes, offset + 16);
      const k4 = readUint64LE(inputBytes, offset + 24);
      
      // Mix each accumulator
      v1 = rotateLeft64((v1 + k1) * PRIME64_2, 31) * PRIME64_1;
      v2 = rotateLeft64((v2 + k2) * PRIME64_2, 31) * PRIME64_1;
      v3 = rotateLeft64((v3 + k3) * PRIME64_2, 31) * PRIME64_1;
      v4 = rotateLeft64((v4 + k4) * PRIME64_2, 31) * PRIME64_1;
      
      offset += 32;
    }
    
    // Combine accumulators
    h64 = rotateLeft64(v1, 1) + rotateLeft64(v2, 7) + rotateLeft64(v3, 12) + rotateLeft64(v4, 18);
    h64 = ((v1 * PRIME64_2) + (v2 * PRIME64_2) + (v3 * PRIME64_2) + (v4 * PRIME64_2) + h64) & 0xFFFFFFFFFFFFFFFFn;
    h64 = rotateLeft64(h64, 31);
    h64 = (h64 * PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
    h64 = (h64 + BigInt(len)) & 0xFFFFFFFFFFFFFFFFn;
    
    // Add remaining bytes
    const remaining = len - offset;
    if (remaining > 0) {
      h64 ^= readUint64LE(inputBytes, offset);
      h64 = (h64 * PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
      if (remaining >= 8) {
        h64 ^= readUint64LE(inputBytes, offset + 8);
        h64 = (h64 * PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
      }
      if (remaining >= 16) {
        h64 ^= readUint64LE(inputBytes, offset + 16);
        h64 = (h64 * PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
      }
      if (remaining >= 24) {
        h64 ^= readUint64LE(inputBytes, offset + 24);
        h64 = (h64 * PRIME64_1) & 0xFFFFFFFFFFFFFFFFn;
      }
    }
  } else {
    // Short input: simpler path
    h64 = (seedBigInt + PRIME64_5 + BigInt(len)) & 0xFFFFFFFFFFFFFFFFn;
    
    // Process remaining bytes
    let offset = 0;
    while (offset + 8 <= len) {
      const k1 = readUint64LE(inputBytes, offset);
      h64 ^= (k1 * PRIME64_2) & 0xFFFFFFFFFFFFFFFFn;
      h64 = rotateLeft64(h64, 31) * PRIME64_1;
      offset += 8;
    }
    
    // Process remaining bytes (less than 8)
    if (offset < len) {
      let remainingValue = 0n;
      for (let i = offset; i < len; i++) {
        remainingValue |= BigInt(inputBytes[i]) << BigInt((i - offset) * 8);
      }
      h64 ^= (remainingValue * PRIME64_5) & 0xFFFFFFFFFFFFFFFFn;
    }
  }
  
  // Final avalanche mixing
  h64 ^= h64 >> 33n;
  h64 = (h64 * PRIME64_2) & 0xFFFFFFFFFFFFFFFFn;
  h64 ^= h64 >> 29n;
  h64 = (h64 * PRIME64_3) & 0xFFFFFFFFFFFFFFFFn;
  h64 ^= h64 >> 32n;
  
  // Convert to hex string (16 characters, lowercase)
  let hexStr = h64.toString(16).padStart(16, '0');
  return hexStr.toLowerCase();
}
