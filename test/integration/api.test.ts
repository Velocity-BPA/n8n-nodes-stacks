/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Stacks node
 *
 * These tests require a connection to the Stacks API.
 * Set environment variable HIRO_API_KEY for authenticated requests.
 *
 * To run integration tests:
 * HIRO_API_KEY=your-key npm test -- --testPathPattern=integration
 */

import { HiroApiClient, type HiroApiCredentials } from '../../nodes/Stacks/transport/hiroApi';

const TEST_ADDRESS = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

// Create a test client using mainnet
function createTestClient(): HiroApiClient {
  const credentials: HiroApiCredentials = {
    apiEndpoint: 'mainnet',
    apiKey: process.env.HIRO_API_KEY,
  };
  return new HiroApiClient(credentials);
}

describe('Hiro API Client Integration', () => {
  const client = createTestClient();

  describe('Account Operations', () => {
    it('should get account balance', async () => {
      const result = await client.getAccountBalance(TEST_ADDRESS) as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('stx');
    }, 10000);

    it('should get account nonces', async () => {
      const result = await client.getAccountNonces(TEST_ADDRESS) as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('possible_next_nonce');
    }, 10000);
  });

  describe('Block Operations', () => {
    it('should get recent blocks', async () => {
      const result = await client.getBlocks({ limit: 5 }) as { results: unknown[] };
      expect(result).toBeDefined();
      expect(result).toHaveProperty('results');
      expect(result.results.length).toBeGreaterThan(0);
    }, 10000);

    it('should get a specific block by height', async () => {
      const result = await client.getBlockByHeight(1) as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('height');
    }, 10000);
  });

  describe('Network Info Operations', () => {
    it('should get core info', async () => {
      const result = await client.getCoreInfo() as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('server_version');
    }, 10000);

    it('should get total STX supply', async () => {
      const result = await client.getTotalSupply() as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('total_stx');
    }, 10000);

    it('should get PoX info', async () => {
      const result = await client.getPoxInfo() as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('contract_id');
    }, 10000);
  });

  describe('Search Operations', () => {
    it('should search for an address', async () => {
      const result = await client.search(TEST_ADDRESS) as Record<string, unknown>;
      expect(result).toBeDefined();
      expect(result).toHaveProperty('found');
    }, 10000);
  });
});

describe('Error Handling', () => {
  const client = createTestClient();

  it('should handle invalid address gracefully', async () => {
    await expect(client.getAccountBalance('invalid-address')).rejects.toThrow();
  }, 10000);

  it('should handle non-existent block', async () => {
    await expect(client.getBlockByHeight(999999999)).rejects.toThrow();
  }, 10000);
});
