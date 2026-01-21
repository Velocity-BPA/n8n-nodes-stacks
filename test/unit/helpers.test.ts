/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  isValidStacksAddress,
  isValidContractId,
  microStxToStx,
  stxToMicroStx,
  parseContractId,
} from '../../nodes/Stacks/utils/clarityHelpers';

describe('Clarity Helpers', () => {
  describe('isValidStacksAddress', () => {
    it('should validate mainnet addresses', () => {
      expect(isValidStacksAddress('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(true);
      expect(isValidStacksAddress('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(true);
    });

    it('should validate testnet addresses', () => {
      expect(isValidStacksAddress('ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(true);
      expect(isValidStacksAddress('SN2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidStacksAddress('')).toBe(false);
      expect(isValidStacksAddress('invalid')).toBe(false);
      expect(isValidStacksAddress('0x1234567890abcdef')).toBe(false);
      expect(isValidStacksAddress('XX2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(false);
    });
  });

  describe('isValidContractId', () => {
    it('should validate contract IDs', () => {
      expect(isValidContractId('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name')).toBe(true);
      expect(isValidContractId('ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract')).toBe(true);
    });

    it('should reject invalid contract IDs', () => {
      expect(isValidContractId('')).toBe(false);
      expect(isValidContractId('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')).toBe(false);
      expect(isValidContractId('invalid.contract')).toBe(false);
      expect(isValidContractId('.contract-name')).toBe(false);
    });
  });

  describe('microStxToStx', () => {
    it('should convert microSTX to STX', () => {
      expect(microStxToStx('1000000')).toBe('1.000000');
      expect(microStxToStx('1500000')).toBe('1.500000');
      expect(microStxToStx('100')).toBe('0.000100');
      expect(microStxToStx('0')).toBe('0.000000');
    });
  });

  describe('stxToMicroStx', () => {
    it('should convert STX to microSTX', () => {
      expect(stxToMicroStx(1)).toBe(BigInt(1000000));
      expect(stxToMicroStx(1.5)).toBe(BigInt(1500000));
      expect(stxToMicroStx(0)).toBe(BigInt(0));
    });
  });

  describe('parseContractId', () => {
    it('should parse valid contract IDs', () => {
      const result = parseContractId('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract');
      expect(result).toEqual({
        address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
        name: 'my-contract',
      });
    });

    it('should throw on invalid contract IDs', () => {
      expect(() => parseContractId('invalid')).toThrow();
      expect(() => parseContractId('')).toThrow();
    });
  });
});

describe('Response Helpers', () => {
  // Import after mocking if needed
  const { formatResponse, emptyResponse } = require('../../nodes/Stacks/utils/responseHelpers');

  describe('formatResponse', () => {
    it('should format single object response', () => {
      const data = { id: 1, name: 'test' };
      const result = formatResponse(data, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(data);
      expect(result[0].pairedItem).toEqual({ item: 0 });
    });

    it('should format array response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = formatResponse(data, 0);
      expect(result).toHaveLength(2);
    });
  });

  describe('emptyResponse', () => {
    it('should return empty response with message', () => {
      const result = emptyResponse(0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ success: true, message: 'No results found' });
    });
  });
});
