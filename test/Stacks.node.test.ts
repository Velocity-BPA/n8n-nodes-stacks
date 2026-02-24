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

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
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
describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  test('getAllTransactions - successful execution', async () => {
    const mockResponse = {
      results: [
        {
          tx_id: '0x123',
          tx_type: 'token_transfer',
          tx_status: 'success',
        },
      ],
      total: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAllTransactions';
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
      url: 'https://api.mainnet.hiro.so/extended/v1/tx?limit=20&offset=0',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      json: true,
    });
  });

  test('getTransaction - successful execution', async () => {
    const mockResponse = {
      tx_id: '0x123456789',
      tx_type: 'token_transfer',
      tx_status: 'success',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTransaction';
        case 'txId': return '0x123456789';
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
      url: 'https://api.mainnet.hiro.so/extended/v1/tx/0x123456789',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      json: true,
    });
  });

  test('getMempoolTransactions - successful execution', async () => {
    const mockResponse = {
      results: [
        {
          tx_id: '0x456',
          tx_type: 'contract_call',
          tx_status: 'pending',
        },
      ],
      total: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getMempoolTransactions';
        case 'limit': return 10;
        case 'offset': return 5;
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
      url: 'https://api.mainnet.hiro.so/extended/v1/tx/mempool?limit=10&offset=5',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      json: true,
    });
  });

  test('broadcastTransaction - successful execution', async () => {
    const mockResponse = {
      txid: '0x789',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'broadcastTransaction';
        case 'transactionData': return '0x00000000';
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
      url: 'https://api.mainnet.hiro.so/v2/transactions',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-API-Key': 'test-api-key',
      },
      body: '0x00000000',
    });
  });

  test('getAddressTransactions - successful execution', async () => {
    const mockResponse = {
      results: [
        {
          tx_id: '0x999',
          tx_type: 'smart_contract',
          tx_status: 'success',
        },
      ],
      total: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAddressTransactions';
        case 'address': return 'SP1ABC123';
        case 'limit': return 50;
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
      url: 'https://api.mainnet.hiro.so/extended/v1/address/SP1ABC123/transactions?limit=50&offset=0',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      json: true,
    });
  });

  test('error handling', async () => {
    const mockError = new Error('API Error');

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTransaction';
        case 'txId': return 'invalid-tx-id';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
    expect(result[0].json.operation).toBe('getTransaction');
  });
});

describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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
    it('should get account balance successfully', async () => {
      const mockResponse = {
        stx: {
          balance: '1000000',
          total_sent: '0',
          total_received: '1000000',
        },
        fungible_tokens: {},
        non_fungible_tokens: {},
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccountBalance';
        if (paramName === 'address') return 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
        baseUrl: 'https://api.mainnet.hiro.so',
        url: 'https://api.mainnet.hiro.so/extended/v1/address/SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS/balances',
      });
    });

    it('should handle API errors for getAccountBalance', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccountBalance';
        if (paramName === 'address') return 'invalid-address';
        return undefined;
      });

      const mockError = new Error('Invalid address format');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Invalid address format' });
    });
  });

  describe('getAccountInfo', () => {
    it('should get account info successfully', async () => {
      const mockResponse = {
        balance: '1000000',
        nonce: 5,
        balance_proof: '0x...',
        nonce_proof: '0x...',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccountInfo';
        if (paramName === 'address') return 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getStxInbound', () => {
    it('should get STX inbound transactions successfully', async () => {
      const mockResponse = {
        limit: 50,
        offset: 0,
        total: 10,
        results: [
          {
            sender: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
            amount: '500000',
            memo: '0x',
            block_height: 12345,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getStxInbound';
        if (paramName === 'address') return 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS';
        if (paramName === 'limit') return defaultValue || 50;
        if (paramName === 'offset') return defaultValue || 0;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getAccountAssets', () => {
    it('should get account assets successfully', async () => {
      const mockResponse = {
        limit: 50,
        offset: 0,
        total: 5,
        results: [
          {
            asset_identifier: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.arkadiko-token::diko',
            balance: '1000000',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getAccountAssets';
        if (paramName === 'address') return 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS';
        if (paramName === 'limit') return defaultValue || 50;
        if (paramName === 'offset') return defaultValue || 0;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
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
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getContract operation', () => {
    it('should get contract details successfully', async () => {
      const mockResponse = {
        contract_id: 'SP000000000000000000002Q6VF78.pox',
        source_code: '(define-public (test) (ok true))',
        block_height: 1000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'getContract',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          network: 'mainnet',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle contract not found error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'getContract',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'nonexistent',
          network: 'mainnet',
        };
        return params[param];
      });

      const error = new Error('Contract not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Contract not found');
    });
  });

  describe('callReadOnlyFunction operation', () => {
    it('should call read-only function successfully', async () => {
      const mockResponse = {
        okay: true,
        result: '0x01',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'callReadOnlyFunction',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          functionName: 'get-stacker-info',
          arguments: '["SP1234567890"]',
          sender: '',
          network: 'mainnet',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle invalid JSON arguments', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'callReadOnlyFunction',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          functionName: 'get-stacker-info',
          arguments: 'invalid-json',
          network: 'mainnet',
        };
        return params[param];
      });

      await expect(
        executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Invalid JSON in arguments parameter');
    });
  });

  describe('getContractEvents operation', () => {
    it('should get contract events successfully', async () => {
      const mockResponse = {
        results: [
          {
            event_index: 1,
            event_type: 'smart_contract_log',
            contract_log: {
              contract_id: 'SP000000000000000000002Q6VF78.pox',
              topic: 'print',
              value: { hex: '0x01' },
            },
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'getContractEvents',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          limit: 100,
          offset: 0,
          network: 'mainnet',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getContractSource operation', () => {
    it('should get contract source successfully', async () => {
      const mockResponse = {
        source: '(define-public (test) (ok true))',
        publish_height: 1000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        const params: any = {
          operation: 'getContractSource',
          contractAddress: 'SP000000000000000000002Q6VF78',
          contractName: 'pox',
          network: 'mainnet',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  it('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    await expect(
      executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('NonFungibleTokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getAllNftHoldings', () => {
    it('should get all NFT holdings successfully', async () => {
      const mockResponse = {
        results: [
          {
            asset_identifier: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft',
            value: '1',
            recipient: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
            tx_id: '0x1234567890abcdef',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getAllNftHoldings';
          case 'assetIdentifiers': return 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNonFungibleTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/tokens/nft/holdings?asset_identifiers=SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft%3A%3Amiamicoin-nft&limit=50&offset=0',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getNftEvents', () => {
    it('should get NFT events for address successfully', async () => {
      const mockResponse = {
        nft_events: [
          {
            sender: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
            recipient: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
            asset_identifier: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft',
            value: { hex: '0x01', repr: '1' },
            tx_id: '0x1234567890abcdef',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getNftEvents';
          case 'address': return 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNonFungibleTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/address/SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5/nft_events?limit=50&offset=0',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getNftMints', () => {
    it('should get NFT mint events successfully', async () => {
      const mockResponse = {
        results: [
          {
            recipient: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
            asset_identifier: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft',
            value: { hex: '0x01', repr: '1' },
            tx_id: '0x1234567890abcdef',
            block_height: 12345,
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getNftMints';
          case 'assetIdentifier': return 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNonFungibleTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getNftHistory', () => {
    it('should get NFT transaction history successfully', async () => {
      const mockResponse = {
        results: [
          {
            sender: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
            recipient: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5',
            asset_identifier: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft',
            value: { hex: '0x01', repr: '1' },
            tx_id: '0x1234567890abcdef',
            block_height: 12345,
            event_type: 'non_fungible_token_asset',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getNftHistory';
          case 'assetIdentifier': return 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-nft::miamicoin-nft';
          case 'value': return '1';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNonFungibleTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('API Error');
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getNftHistory';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNonFungibleTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Stacking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getStackingRewards', () => {
    it('should get stacking rewards for an address', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        results: [
          {
            canonical: true,
            burn_block_hash: '0x123',
            burn_block_height: 12345,
            address: 'SP1ABC123DEF456',
            slot_index: 0,
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStackingRewards';
          case 'address': return 'SP1ABC123DEF456';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/burnchain/reward_slot_holders/SP1ABC123DEF456',
        qs: { limit: 20, offset: 0 },
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-api-key' },
        json: true,
      });
    });

    it('should handle errors for getStackingRewards', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStackingRewards';
          case 'address': return 'SP1ABC123DEF456';
          default: return undefined;
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API Error');
    });
  });

  describe('getAllStackingRewards', () => {
    it('should get all stacking rewards', async () => {
      const mockResponse = {
        limit: 20,
        offset: 0,
        results: [
          {
            canonical: true,
            burn_block_hash: '0x123',
            burn_block_height: 12345,
            reward_recipient: 'SP1ABC123DEF456',
            reward_amount: '1000000',
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllStackingRewards';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/burnchain/rewards',
        qs: { limit: 20, offset: 0 },
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-api-key' },
        json: true,
      });
    });
  });

  describe('getPoxInfo', () => {
    it('should get PoX information', async () => {
      const mockResponse = {
        contract_id: 'SP000000000000000000002Q6VF78.pox',
        pox_activation_threshold_ustx: '4000000000000000',
        first_burnchain_block_height: 666050,
        current_cycle: {
          id: 10,
          min_threshold_ustx: '1000000000000',
          stacked_ustx: '5000000000000',
          is_pox_active: true,
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getPoxInfo';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v2/pox',
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-api-key' },
        json: true,
      });
    });
  });

  describe('getTotalStackingRewards', () => {
    it('should get total stacking rewards', async () => {
      const mockResponse = {
        reward_recipient_count: 150,
        total_reward_amount_ustx: '50000000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTotalStackingRewards';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/burnchain/rewards/total',
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-api-key' },
        json: true,
      });
    });
  });
});

describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getBlocks operation', () => {
    it('should get recent blocks successfully', async () => {
      const mockBlocks = {
        limit: 20,
        offset: 0,
        total: 100,
        results: [
          {
            canonical: true,
            height: 123456,
            hash: '0x123abc',
            block_time: 1234567890,
            block_time_iso: '2009-02-13T23:31:30.000Z'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlocks';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocks);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/block',
        qs: {
          limit: 20,
          offset: 0,
        },
        json: true,
        headers: {
          'X-API-Key': 'test-api-key',
        },
      });

      expect(result).toEqual([{ json: mockBlocks, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when getting blocks', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlocks';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('getBlockByHash operation', () => {
    it('should get block by hash successfully', async () => {
      const mockBlock = {
        canonical: true,
        height: 123456,
        hash: '0x123abc',
        block_time: 1234567890,
        block_time_iso: '2009-02-13T23:31:30.000Z',
        txs: []
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockByHash';
          case 'hash': return '0x123abc';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlock);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/block/0x123abc',
        json: true,
        headers: {
          'X-API-Key': 'test-api-key',
        },
      });

      expect(result).toEqual([{ json: mockBlock, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockByHeight operation', () => {
    it('should get block by height successfully', async () => {
      const mockBlock = {
        canonical: true,
        height: 123456,
        hash: '0x123abc',
        block_time: 1234567890,
        block_time_iso: '2009-02-13T23:31:30.000Z',
        txs: []
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockByHeight';
          case 'height': return 123456;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlock);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/block/by_height/123456',
        json: true,
        headers: {
          'X-API-Key': 'test-api-key',
        },
      });

      expect(result).toEqual([{ json: mockBlock, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockTransactions operation', () => {
    it('should get block transactions successfully', async () => {
      const mockTransactions = {
        limit: 20,
        offset: 0,
        total: 5,
        results: [
          {
            tx_id: '0xabc123',
            tx_type: 'contract_call',
            fee_rate: '1000',
            nonce: 1
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getBlockTransactions';
          case 'hash': return '0x123abc';
          case 'limit': return 20;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactions);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/block/0x123abc/transactions',
        qs: {
          limit: 20,
          offset: 0,
        },
        json: true,
        headers: {
          'X-API-Key': 'test-api-key',
        },
      });

      expect(result).toEqual([{ json: mockTransactions, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Names Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getNameInfo', () => {
    it('should get name registration details successfully', async () => {
      const mockResponse = {
        name: 'test.btc',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        status: 'registered',
        expire_block: 123456,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getNameInfo';
        if (param === 'name') return 'test.btc';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v1/names/test.btc',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getNamesByAddress', () => {
    it('should get names owned by address successfully', async () => {
      const mockResponse = {
        names: ['test1.btc', 'test2.btc'],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getNamesByAddress';
        if (param === 'address') return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v1/addresses/bitcoin/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getAllNamespaces', () => {
    it('should get all namespaces successfully', async () => {
      const mockResponse = {
        namespaces: ['btc', 'id'],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAllNamespaces';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v1/namespaces',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getAllNames', () => {
    it('should get all names with pagination successfully', async () => {
      const mockResponse = {
        names: ['test1.btc', 'test2.btc'],
        total: 100,
        page: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAllNames';
        if (param === 'page') return 1;
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v1/names?page=1',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getSubdomainInfo', () => {
    it('should get subdomain information successfully', async () => {
      const mockResponse = {
        subdomain: 'sub.test.btc',
        owner: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        zonefile: 'zonefile content',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSubdomainInfo';
        if (param === 'subdomain') return 'sub.test.btc';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/v1/subdomains/sub.test.btc',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getNameInfo';
        if (param === 'name') return 'nonexistent.btc';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Name not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeNamesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Name not found');
    });
  });
});

describe('FungibleTokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.mainnet.hiro.so',
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

  describe('getFtMetadata', () => {
    it('should get fungible token metadata successfully', async () => {
      const mockResponse = {
        name: 'Test Token',
        symbol: 'TEST',
        decimals: 6,
        description: 'A test fungible token',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getFtMetadata';
        if (paramName === 'contractId') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-token';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/tokens/ft/metadata',
        qs: {
          contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-token',
        },
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        json: true,
      });
    });

    it('should handle getFtMetadata error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getFtMetadata';
        if (paramName === 'contractId') return 'invalid-contract';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contract not found'));

      await expect(
        executeFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Contract not found');
    });
  });

  describe('getAllFungibleTokens', () => {
    it('should get all fungible tokens successfully', async () => {
      const mockResponse = {
        results: [
          { contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token1', name: 'Token 1' },
          { contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token2', name: 'Token 2' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getAllFungibleTokens';
        if (paramName === 'limit') return defaultValue || 96;
        if (paramName === 'offset') return defaultValue || 0;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/tokens/ft',
        qs: {
          limit: 96,
          offset: 0,
        },
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getFtEvents', () => {
    it('should get fungible token events successfully', async () => {
      const mockResponse = {
        events: [
          {
            event_type: 'ft_transfer_event',
            asset_identifier: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-token::test-token',
            amount: '1000000',
            sender: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
            recipient: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getFtEvents';
        if (paramName === 'address') return 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
        if (paramName === 'limit') return defaultValue || 96;
        if (paramName === 'offset') return defaultValue || 0;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/address/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/ft_events',
        qs: {
          limit: 96,
          offset: 0,
        },
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getFtSupply', () => {
    it('should get token supply successfully', async () => {
      const mockResponse = {
        total_supply: '21000000000000',
        circulating_supply: '18500000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getFtSupply';
        if (paramName === 'contractId') return 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-token';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.mainnet.hiro.so/extended/v1/tokens/ft/SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-token/supply',
        headers: {
          Authorization: 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });
});
});
