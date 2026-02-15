/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Stacks } from '../nodes/Stacks/Stacks.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Stacks Node', () => {
  let node: Stacks;

  beforeAll(() => {
    node = new Stacks();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Stacks');
      expect(node.description.name).toBe('stacks');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getLatestBlock', () => {
    it('should get the latest block successfully', async () => {
      const mockResponse = {
        canonical: true,
        height: 123456,
        hash: '0xabc123',
        block_time: 1640995200,
        block_time_iso: '2022-01-01T00:00:00.000Z',
        txs: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getLatestBlock';
        return undefined;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getLatestBlock';
        return undefined;
      });
      
      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getBlockByHash', () => {
    it('should get block by hash successfully', async () => {
      const mockResponse = {
        canonical: true,
        height: 123456,
        hash: '0xabc123def456',
        block_time: 1640995200,
        txs: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBlockByHash';
        if (name === 'hash') return '0xabc123def456';
        return undefined;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block/0xabc123def456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should validate hash format', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBlockByHash';
        if (name === 'hash') return 'invalid-hash';
        return undefined;
      });

      await expect(
        executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Block hash must be in hexadecimal format');
    });
  });

  describe('getBlockByHeight', () => {
    it('should get block by height successfully', async () => {
      const mockResponse = {
        canonical: true,
        height: 123456,
        hash: '0xabc123def456',
        block_time: 1640995200,
        txs: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBlockByHeight';
        if (name === 'height') return 123456;
        return undefined;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block/by_height/123456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should validate block height', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number) => {
        if (name === 'operation') return 'getBlockByHeight';
        if (name === 'height') return -1;
        return undefined;
      });

      await expect(
        executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Block height must be a non-negative number');
    });
  });

  describe('listBlocks', () => {
    it('should list blocks with default parameters', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        total: 1000,
        results: [
          { height: 123456, hash: '0xabc123', block_time: 1640995200 },
          { height: 123455, hash: '0xdef456', block_time: 1640995100 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number, defaultValue?: any) => {
        if (name === 'operation') return 'listBlocks';
        if (name === 'limit') return defaultValue || 20;
        if (name === 'offset') return defaultValue || 0;
        return undefined;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should list blocks with custom parameters', async () => {
      const mockResponse = {
        limit: 10,
        offset: 5,
        total: 1000,
        results: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, index: number, defaultValue?: any) => {
        if (name === 'operation') return 'listBlocks';
        if (name === 'limit') return 10;
        if (name === 'offset') return 5;
        return defaultValue;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/block?limit=10&offset=5',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('listTransactions should return recent transactions', async () => {
    const mockResponse = {
      limit: 20,
      offset: 0,
      total: 100,
      results: [
        {
          tx_id: '0x1234567890abcdef',
          tx_type: 'token_transfer',
          tx_status: 'success',
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'listTransactions';
        case 'limit': return 20;
        case 'offset': return 0;
        case 'type': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tx?limit=20&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getTransaction should return specific transaction', async () => {
    const mockResponse = {
      tx_id: '0x1234567890abcdef',
      tx_type: 'token_transfer',
      tx_status: 'success',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getTransaction';
        case 'txId': return '0x1234567890abcdef';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/0x1234567890abcdef',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('broadcastTransaction should broadcast transaction', async () => {
    const mockResponse = { txid: '0x1234567890abcdef' };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'broadcastTransaction';
        case 'transactionData': return '0xabcdef1234567890';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://stacks-node-api.mainnet.stacks.co/v2/transactions',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/octet-stream',
      },
      body: '0xabcdef1234567890',
    });
  });

  test('getMempoolTransactions should return pending transactions', async () => {
    const mockResponse = {
      limit: 20,
      offset: 0,
      total: 10,
      results: [
        {
          tx_id: '0x1234567890abcdef',
          tx_type: 'contract_call',
          tx_status: 'pending',
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getMempoolTransactions';
        case 'limit': return 20;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/mempool?limit=20&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAddressTransactions should return transactions for address', async () => {
    const mockResponse = {
      limit: 20,
      offset: 0,
      total: 50,
      results: [
        {
          tx_id: '0x1234567890abcdef',
          tx_type: 'token_transfer',
          tx_status: 'success',
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getAddressTransactions';
        case 'address': return 'SP1234567890ABCDEF';
        case 'limit': return 20;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/address/SP1234567890ABCDEF/transactions?limit=20&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getTransaction';
        case 'txId': return 'invalid-tx-id';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('error');
  });
});

describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAccountBalance', () => {
    it('should successfully get account balance', async () => {
      const mockResponse = {
        stx: {
          balance: '1000000000',
          total_sent: '0',
          total_received: '1000000000',
          lock_tx_id: '',
          locked: '0',
          lock_height: 0,
          burnchain_lock_height: 0,
          burnchain_unlock_height: 0
        },
        fungible_tokens: {},
        non_fungible_tokens: {}
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountBalance';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/address/SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9/balances',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle invalid address error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountBalance';
        if (param === 'address') return 'invalid-address';
        return null;
      });

      await expect(executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('Invalid Stacks address: invalid-address');
    });
  });

  describe('getAccountSTXBalance', () => {
    it('should successfully get account STX balance', async () => {
      const mockResponse = {
        balance: '1000000000',
        total_sent: '0',
        total_received: '1000000000',
        lock_tx_id: '',
        locked: '0',
        lock_height: 0,
        burnchain_lock_height: 0,
        burnchain_unlock_height: 0
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountSTXBalance';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getAccountAssets', () => {
    it('should successfully get account assets', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        total: 1,
        results: [
          {
            event_index: 1,
            event_type: 'fungible_token_asset',
            asset: {
              asset_event_type: 'mint',
              asset_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-name',
              sender: '',
              recipient: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
              amount: '1000'
            }
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountAssets';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getAccountNonces', () => {
    it('should successfully get account nonces', async () => {
      const mockResponse = {
        last_executed_tx_nonce: 0,
        last_mempool_tx_nonce: null,
        possible_next_nonce: 1,
        detected_missing_nonces: []
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountNonces';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getAccountInfo', () => {
    it('should successfully get account info', async () => {
      const mockResponse = {
        balance: '0x0000000000000000000000003b9aca00',
        locked: '0x00000000000000000000000000000000',
        unlock_height: 0,
        nonce: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountInfo';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getAccountBalance';
        if (param === 'address') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
        return null;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'unknownOperation';
        return null;
      });

      await expect(executeAccountsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('SmartContracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get contract info successfully', async () => {
    const mockResponse = {
      contract_id: 'SP000000000000000000002Q6VF78.pox',
      source_code: '(define-read-only (test) u42)',
      abi: {}
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getContractInfo';
        case 'contractId':
          return 'SP000000000000000000002Q6VF78.pox';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/contract/SP000000000000000000002Q6VF78.pox',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should call read-only function successfully', async () => {
    const mockResponse = {
      okay: true,
      result: '0x0100000000000000000000000000000001'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'callReadOnlyFunction';
        case 'contractAddress':
          return 'SP000000000000000000002Q6VF78';
        case 'contractName':
          return 'pox';
        case 'functionName':
          return 'get-stacker-info';
        case 'arguments':
          return '["SP000000000000000000002Q6VF78"]';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get contract events successfully', async () => {
    const mockResponse = {
      events: [],
      total: 0,
      limit: 50,
      offset: 0
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getContractEvents';
        case 'contractAddress':
          return 'SP000000000000000000002Q6VF78';
        case 'contractName':
          return 'pox';
        case 'limit':
          return 50;
        case 'offset':
          return 0;
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get contract source successfully', async () => {
    const mockResponse = {
      source: '(define-read-only (test) u42)',
      publish_height: 1
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getContractSource';
        case 'contractAddress':
          return 'SP000000000000000000002Q6VF78';
        case 'contractName':
          return 'pox';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get contract details successfully', async () => {
    const mockResponse = {
      contract_id: 'SP000000000000000000002Q6VF78.pox',
      clarity_version: 1,
      source_code: '(define-read-only (test) u42)'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getContractDetails';
        case 'contractAddress':
          return 'SP000000000000000000002Q6VF78';
        case 'contractName':
          return 'pox';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getContractInfo';
      if (param === 'contractId') return 'invalid-contract';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contract not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeSmartContractsOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: { error: 'Contract not found' }, pairedItem: { item: 0 } }]);
  });
});

describe('TokensAndAssets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listFungibleTokens', () => {
    it('should list fungible tokens successfully', async () => {
      const mockResponse = {
        results: [
          {
            contract_id: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2',
            name: 'MiamiCoin Token',
            symbol: 'MIA',
            decimals: 6,
          },
        ],
        limit: 20,
        offset: 0,
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'listFungibleTokens';
        if (param === 'limit') return 20;
        if (param === 'offset') return 0;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tokens/ft',
        qs: { limit: 20, offset: 0 },
        headers: { 'Content-Type': 'application/json', 'X-API-Key': 'test-api-key' },
        json: true,
      });
    });
  });

  describe('getNFTHoldings', () => {
    it('should get NFT holdings successfully', async () => {
      const mockResponse = {
        results: [
          {
            asset_identifier: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.the-explorer-guild::The-Explorer-Guild',
            value: { hex: '0x0100000000000000000000000000000001', repr: 'u1' },
          },
        ],
        limit: 20,
        offset: 0,
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getNFTHoldings';
        if (param === 'address') return 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R';
        if (param === 'limit') return 20;
        if (param === 'offset') return 0;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle invalid address', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getNFTHoldings';
        if (param === 'address') return 'invalid-address';
        return defaultValue;
      });

      await expect(
        executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid Stacks address: invalid-address');
    });
  });

  describe('getFungibleTokenMetadata', () => {
    it('should get fungible token metadata successfully', async () => {
      const mockResponse = {
        name: 'MiamiCoin Token',
        symbol: 'MIA',
        decimals: 6,
        total_supply: '1000000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getFungibleTokenMetadata';
        if (param === 'contractId') return 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2';
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle invalid contract ID', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getFungibleTokenMetadata';
        if (param === 'contractId') return 'invalid-contract-id';
        return defaultValue;
      });

      await expect(
        executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid contract ID format: invalid-contract-id');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'listFungibleTokens';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue({
        message: 'API Error',
        httpCode: 500,
      });

      await expect(
        executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'listFungibleTokens';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeTokensAndAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('NetworkInfo Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getNetworkInfo', () => {
		it('should get core network information successfully', async () => {
			const mockNetworkInfo = {
				peer_version: 385875968,
				pox_consensus: 'bb88a6e6e65fa7c974d3f6e91a941d05cc3456a9',
				burn_block_height: 751234,
				stable_pox_consensus: 'bb88a6e6e65fa7c974d3f6e91a941d05cc3456a9',
				stable_burn_block_height: 751234,
				server_version: 'stacks-node 2.05.0.0.0',
				network_id: 1,
				parent_network_id: 3652501241,
				stacks_tip_height: 12345,
				stacks_tip: '0x123abc456def',
				stacks_tip_consensus_hash: '0xabc123def456',
				genesis_txid: '0x4729e3ad6cee474d02b1540ccb2e4b4fc9b5b3b1e5b5f5b5f5b5f5b5f5b5f5b5',
				unanchored_tip_height: 12346,
				unanchored_tip: '0x789ghi012jkl'
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getNetworkInfo';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNetworkInfo);

			const items = [{ json: {} }];
			const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://stacks-node-api.mainnet.stacks.co/v2/info',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockNetworkInfo, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting network info', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getNetworkInfo';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

			const items = [{ json: {} }];

			await expect(executeNetworkInfoOperations.call(mockExecuteFunctions, items))
				.rejects
				.toThrow('Network error');
		});
	});

	describe('getNetworkStatus', () => {
		it('should get extended network status successfully', async () => {
			const mockNetworkStatus = {
				server_version: 'stacks-node 2.05.0.0.0',
				status: 'ready',
				pox_v1_unlock_height: 630000,
				pox_v2_unlock_height: 745000,
				chain_tip: {
					block_height: 12345,
					block_hash: '0x123abc456def',
					index_block_hash: '0xabc123def456'
				}
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getNetworkStatus';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNetworkStatus);

			const items = [{ json: {} }];
			const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/status',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockNetworkStatus, pairedItem: { item: 0 } }]);
		});
	});

	describe('getTransferFees', () => {
		it('should get transfer fees successfully', async () => {
			const mockTransferFees = {
				units: 'microSTX',
				low: 180,
				medium: 240,
				high: 300
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getTransferFees';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransferFees);

			const items = [{ json: {} }];
			const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://stacks-node-api.mainnet.stacks.co/v2/fees/transfer',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockTransferFees, pairedItem: { item: 0 } }]);
		});
	});

	describe('getFeeRates', () => {
		it('should get fee rates successfully', async () => {
			const mockFeeRates = {
				fee_rate: 1.5
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getFeeRates';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFeeRates);

			const items = [{ json: {} }];
			const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/fee_rate',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockFeeRates, pairedItem: { item: 0 } }]);
		});
	});

	describe('getNetworkStats', () => {
		it('should get network statistics successfully', async () => {
			const mockNetworkStats = {
				block_count: 12345,
				txs_count: 987654,
				addresses_count: 54321,
				smart_contracts_count: 1234,
				total_fees: '123456789'
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getNetworkStats';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNetworkStats);

			const items = [{ json: {} }];
			const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/stats',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockNetworkStats, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Microblocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://stacks-node-api.mainnet.stacks.co',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getLatestMicroblocks', () => {
    it('should get latest microblocks successfully', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        total: 100,
        results: [
          {
            canonical: true,
            microblock_canonical: true,
            microblock_hash: '0x1234567890abcdef',
            microblock_sequence: 0,
            microblock_parent_hash: '0xabcdef1234567890',
            block_height: 12345,
            parent_block_height: 12344,
            parent_block_hash: '0xparentblockhash',
            parent_burn_block_time: 1634567890,
            parent_burn_block_time_iso: '2021-10-18T12:34:50.000Z',
            parent_burn_block_hash: '0xparentburnblockhash',
            parent_burn_block_height: 678901,
            txs: ['0xtx1', '0xtx2']
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLatestMicroblocks';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/microblock',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        json: true,
      });
    });

    it('should handle errors when getting latest microblocks', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLatestMicroblocks';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getMicroblockByHash', () => {
    it('should get microblock by hash successfully', async () => {
      const mockResponse = {
        canonical: true,
        microblock_canonical: true,
        microblock_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        microblock_sequence: 0,
        microblock_parent_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        block_height: 12345,
        parent_block_height: 12344,
        parent_block_hash: '0xparentblockhash',
        parent_burn_block_time: 1634567890,
        parent_burn_block_time_iso: '2021-10-18T12:34:50.000Z',
        parent_burn_block_hash: '0xparentburnblockhash',
        parent_burn_block_height: 678901,
        txs: ['0xtx1', '0xtx2']
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getMicroblockByHash';
          case 'hash': return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/microblock/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        json: true,
      });
    });

    it('should throw error for invalid hash format', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getMicroblockByHash';
          case 'hash': return 'invalid-hash';
          default: return undefined;
        }
      });

      await expect(executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid microblock hash format');
    });
  });

  describe('getUnanchoredTransactions', () => {
    it('should get unanchored transactions successfully', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        total: 50,
        results: [
          {
            tx_id: '0xtx1234567890abcdef',
            nonce: 1,
            fee_rate: '1000',
            sender_address: 'SP1234567890ABCDEF',
            sponsored: false,
            post_condition_mode: 'allow',
            post_conditions: [],
            anchor_mode: 'any',
            tx_status: 'pending',
            receipt_time: 1634567890,
            receipt_time_iso: '2021-10-18T12:34:50.000Z'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getUnanchoredTransactions';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://stacks-node-api.mainnet.stacks.co/extended/v1/microblock/unanchored/txs',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        json: true,
      });
    });

    it('should handle errors when getting unanchored transactions', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getUnanchoredTransactions';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));

      await expect(executeMicroblocksOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Network Error');
    });
  });
});
});
