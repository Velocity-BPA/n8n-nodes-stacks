/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Encode a value to Clarity hex representation
 */
export function encodeClarityValue(type: string, value: unknown): string {
  switch (type) {
    case 'int':
      return encodeInt(BigInt(value as number | string));
    case 'uint':
      return encodeUint(BigInt(value as number | string));
    case 'bool':
      return encodeBool(value as boolean);
    case 'principal':
      return encodePrincipal(value as string);
    case 'buff':
    case 'buffer':
      return encodeBuffer(value as string);
    case 'string-ascii':
      return encodeStringAscii(value as string);
    case 'string-utf8':
      return encodeStringUtf8(value as string);
    case 'none':
      return '09'; // Clarity none value
    case 'some':
      return encodeSome(value);
    default:
      throw new Error(`Unsupported Clarity type: ${type}`);
  }
}

function encodeInt(value: bigint): string {
  const hex = value.toString(16).padStart(32, '0');
  return '00' + hex;
}

function encodeUint(value: bigint): string {
  const hex = value.toString(16).padStart(32, '0');
  return '01' + hex;
}

function encodeBool(value: boolean): string {
  return value ? '03' : '04';
}

function encodePrincipal(address: string): string {
  // Standard principal encoding
  const isContract = address.includes('.');
  if (isContract) {
    const [addr, contractName] = address.split('.');
    const addrBytes = decodeStacksAddress(addr);
    const nameBytes = Buffer.from(contractName, 'utf8');
    return '06' + addrBytes + nameBytes.length.toString(16).padStart(2, '0') + nameBytes.toString('hex');
  }
  const addrBytes = decodeStacksAddress(address);
  return '05' + addrBytes;
}

function encodeBuffer(hexString: string): string {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const length = (cleanHex.length / 2).toString(16).padStart(8, '0');
  return '02' + length + cleanHex;
}

function encodeStringAscii(str: string): string {
  const hex = Buffer.from(str, 'ascii').toString('hex');
  const length = str.length.toString(16).padStart(8, '0');
  return '0d' + length + hex;
}

function encodeStringUtf8(str: string): string {
  const buffer = Buffer.from(str, 'utf8');
  const hex = buffer.toString('hex');
  const length = buffer.length.toString(16).padStart(8, '0');
  return '0e' + length + hex;
}

function encodeSome(value: unknown): string {
  if (typeof value === 'string') {
    return '0a' + encodeStringUtf8(value);
  }
  throw new Error('Some encoding requires typed inner value');
}

function decodeStacksAddress(address: string): string {
  // Simplified address decoding - returns version byte + hash160
  // In production, use proper c32 decoding
  const versionByte = address.startsWith('SP') || address.startsWith('SM') ? '16' : '1a';
  // This is a simplified placeholder - real implementation would use c32check
  const hash = Buffer.from(address.slice(2), 'utf8').toString('hex').slice(0, 40).padEnd(40, '0');
  return versionByte + hash;
}

/**
 * Decode a Clarity hex value to readable format
 */
export function decodeClarityValue(hexValue: string): unknown {
  const cleanHex = hexValue.startsWith('0x') ? hexValue.slice(2) : hexValue;
  const typePrefix = cleanHex.slice(0, 2);

  switch (typePrefix) {
    case '00': // int
      return BigInt('0x' + cleanHex.slice(2)).toString();
    case '01': // uint
      return BigInt('0x' + cleanHex.slice(2)).toString();
    case '03': // true
      return true;
    case '04': // false
      return false;
    case '09': // none
      return null;
    case '0a': // some
      return { some: decodeClarityValue(cleanHex.slice(2)) };
    case '0d': // string-ascii
    case '0e': // string-utf8
      const strLength = parseInt(cleanHex.slice(2, 10), 16);
      return Buffer.from(cleanHex.slice(10, 10 + strLength * 2), 'hex').toString('utf8');
    default:
      return { raw: cleanHex, type: typePrefix };
  }
}

/**
 * Format microSTX to STX
 */
export function microStxToStx(microStx: bigint | number | string): string {
  const micro = BigInt(microStx);
  const stx = Number(micro) / 1_000_000;
  return stx.toFixed(6);
}

/**
 * Format STX to microSTX
 */
export function stxToMicroStx(stx: number | string): bigint {
  const stxNum = typeof stx === 'string' ? parseFloat(stx) : stx;
  return BigInt(Math.round(stxNum * 1_000_000));
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  // Check basic format
  if (!address || typeof address !== 'string') return false;
  
  // Mainnet addresses start with SP or SM
  // Testnet addresses start with ST or SN
  const validPrefixes = ['SP', 'SM', 'ST', 'SN'];
  const prefix = address.slice(0, 2).toUpperCase();
  
  if (!validPrefixes.includes(prefix)) return false;
  
  // Check length (typically 40-41 characters for standard addresses)
  if (address.length < 38 || address.length > 42) return false;
  
  // Check for valid c32 characters (excluding O, L, I, 0, 1)
  const c32Chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const addressPart = address.slice(2).toUpperCase();
  
  for (const char of addressPart) {
    if (!c32Chars.includes(char)) return false;
  }
  
  return true;
}

/**
 * Validate contract identifier format
 */
export function isValidContractId(contractId: string): boolean {
  if (!contractId || typeof contractId !== 'string') return false;
  
  const parts = contractId.split('.');
  if (parts.length !== 2) return false;
  
  const [address, name] = parts;
  
  // Validate address part
  if (!isValidStacksAddress(address)) return false;
  
  // Validate contract name (alphanumeric and hyphens, 1-40 chars)
  if (!name || name.length < 1 || name.length > 40) return false;
  if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)) return false;
  
  return true;
}

/**
 * Parse contract identifier
 */
export function parseContractId(contractId: string): { address: string; name: string } {
  if (!isValidContractId(contractId)) {
    throw new Error(`Invalid contract identifier: ${contractId}`);
  }
  const [address, name] = contractId.split('.');
  return { address, name };
}
