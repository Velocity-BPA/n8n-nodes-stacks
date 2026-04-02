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
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.hiro.so' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get account details successfully', async () => {
    const mockAccountData = { balance: '1000000', nonce: 1 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockAccountData);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockAccountData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.hiro.so/extended/v1/address/SP1ABC123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get account balances successfully', async () => {
    const mockBalanceData = { stx: { balance: '1000000' }, fungible_tokens: {} };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountBalances';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBalanceData);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBalanceData);
  });

  it('should get account STX info successfully', async () => {
    const mockStxData = { balance: '1000000', locked: '0' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountStx';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockStxData);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockStxData);
  });

  it('should get account transactions with pagination', async () => {
    const mockTransactionData = { limit: 10, offset: 0, total: 100, results: [] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index?: number, defaultValue?: any) => {
      if (param === 'operation') return 'getAccountTransactions';
      if (param === 'principal') return 'SP1ABC123';
      if (param === 'limit') return 10;
      if (param === 'offset') return 0;
      return defaultValue;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactionData);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockTransactionData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('limit=10&offset=0'),
      })
    );
  });

  it('should get account nonces successfully', async () => {
    const mockNonceData = { last_mempool_tx_nonce: 5, last_executed_tx_nonce: 4 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountNonces';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNonceData);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockNonceData);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'principal') return 'SP1ABC123';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(
      executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.hiro.so',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getTransactions', () => {
    it('should get recent transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactions')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        results: [{ tx_id: 'tx123', tx_type: 'coinbase' }],
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/tx?limit=20&offset=0',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveProperty('results');
    });

    it('should handle errors when getting transactions', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransactions');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result[0].json).toHaveProperty('error', 'API Error');
    });
  });

  describe('getTransaction', () => {
    it('should get transaction by ID successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('tx123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        tx_id: 'tx123',
        tx_type: 'coinbase',
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/tx/tx123',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result[0].json).toHaveProperty('tx_id', 'tx123');
    });
  });

  describe('broadcastTransaction', () => {
    it('should broadcast transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('broadcastTransaction')
        .mockReturnValueOnce('deadbeef');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        txid: 'tx123',
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.hiro.so/v2/transactions',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/octet-stream',
        },
        body: 'deadbeef',
      });

      expect(result[0].json).toHaveProperty('txid', 'tx123');
    });
  });

  describe('getMempoolTransactions', () => {
    it('should get mempool transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMempoolTransactions')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        results: [{ tx_id: 'mempool-tx123' }],
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/tx/mempool?limit=10&offset=0',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result[0].json).toHaveProperty('results');
    });
  });

  describe('getMempoolTransaction', () => {
    it('should get mempool transaction by ID successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMempoolTransaction')
        .mockReturnValueOnce('mempool-tx123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        tx_id: 'mempool-tx123',
        tx_status: 'pending',
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/tx/mempool/mempool-tx123',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result[0].json).toHaveProperty('tx_id', 'mempool-tx123');
    });
  });

  describe('getAddressMempoolTransactions', () => {
    it('should get address mempool transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressMempoolTransactions')
        .mockReturnValueOnce('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        results: [{ tx_id: 'addr-mempool-tx123' }],
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/address/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/mempool',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result[0].json).toHaveProperty('results');
    });
  });
});

describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.hiro.so' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getBlocks operation', () => {
    it('should get recent blocks successfully', async () => {
      const mockBlocks = { results: [{ height: 123456, hash: 'block-hash' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocks);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlocks, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/block',
        headers: { 'X-API-Key': 'test-key' },
        qs: { limit: 20, offset: 0 },
        json: true,
      });
    });

    it('should handle getBlocks error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBlocks');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlock operation', () => {
    it('should get block by hash or height successfully', async () => {
      const mockBlock = { height: 123456, hash: 'block-hash' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('123456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlock);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlock, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/extended/v1/block/123456',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });

  describe('getBlockTransactions operation', () => {
    it('should get block transactions successfully', async () => {
      const mockTransactions = { results: [{ tx_id: 'tx-123' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockTransactions')
        .mockReturnValueOnce('123456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactions);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockTransactions, pairedItem: { item: 0 } }]);
    });
  });

  describe('getNetworkInfo operation', () => {
    it('should get network info successfully', async () => {
      const mockNetworkInfo = { network_id: 1, chain_id: 'mainnet' };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getNetworkInfo');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNetworkInfo);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockNetworkInfo, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/v2/info',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });

  describe('getPoxInfo operation', () => {
    it('should get PoX info successfully', async () => {
      const mockPoxInfo = { cycle_id: 1, reward_cycle: 100 };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPoxInfo');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPoxInfo);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockPoxInfo, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.hiro.so/v2/pox',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });
  });
});

describe('Smart Contracts Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.hiro.so'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	describe('getContract operation', () => {
		it('should get contract information successfully', async () => {
			const mockContractData = { contract_id: 'test-contract', source_code: 'test-code' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('test-contract');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockContractData);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockContractData, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.hiro.so/extended/v1/contract/test-contract',
				headers: { 'Authorization': 'Bearer test-key' },
				json: true,
			});
		});

		it('should handle get contract error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('test-contract');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contract not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Contract not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContractInterface operation', () => {
		it('should get contract interface successfully', async () => {
			const mockInterfaceData = { functions: [], maps: [] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractInterface')
				.mockReturnValueOnce('test-contract');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInterfaceData);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockInterfaceData, pairedItem: { item: 0 } }]);
		});
	});

	describe('callReadOnlyFunction operation', () => {
		it('should call read-only function successfully', async () => {
			const mockFunctionResult = { result: 'success', output: 'u100' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('callReadOnlyFunction')
				.mockReturnValueOnce('test-contract')
				.mockReturnValueOnce('get-balance')
				.mockReturnValueOnce('["SP123"]');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFunctionResult);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockFunctionResult, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContractEvents operation', () => {
		it('should get contract events successfully', async () => {
			const mockEventsData = { results: [], total: 0 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractEvents')
				.mockReturnValueOnce('test-contract')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEventsData);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockEventsData, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContractCall operation', () => {
		it('should get contract call details successfully', async () => {
			const mockCallData = { tx_id: 'test-tx-id', function_name: 'transfer' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractCall')
				.mockReturnValueOnce('test-tx-id');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCallData);

			const result = await executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockCallData, pairedItem: { item: 0 } }]);
		});
	});
});

describe('NonFungibleTokens Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.hiro.so',
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

	describe('getNftHoldings', () => {
		it('should get NFT holdings successfully', async () => {
			const mockResponse = { results: [], total: 0 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getNftHoldings')
				.mockReturnValueOnce('SP1ABC123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const result = await executeNonFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.hiro.so/extended/v1/tokens/nft/holdings?principal=SP1ABC123&limit=50&offset=0',
				headers: {
					'X-API-Key': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors gracefully', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNftHoldings');

			const result = await executeNonFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getNftHistory', () => {
		it('should get NFT history successfully', async () => {
			const mockResponse = { results: [], total: 0 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getNftHistory')
				.mockReturnValueOnce('SP1ABC123.test-nft')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const result = await executeNonFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getNftMints', () => {
		it('should get NFT mints successfully', async () => {
			const mockResponse = { results: [], total: 0 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getNftMints')
				.mockReturnValueOnce('SP1ABC123.test-nft')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const result = await executeNonFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getAddressNftEvents', () => {
		it('should get address NFT events successfully', async () => {
			const mockResponse = { results: [], total: 0 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressNftEvents')
				.mockReturnValueOnce('SP1ABC123')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const result = await executeNonFungibleTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('FungibleTokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.hiro.so' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getFungibleTokens', () => {
    it('should get fungible tokens successfully', async () => {
      const mockResponse = { results: [{ contract_id: 'SP123.token' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFungibleTokens')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
    });

    it('should handle errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFungibleTokens');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFungibleTokensOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getFungibleToken', () => {
    it('should get specific fungible token successfully', async () => {
      const mockResponse = { contract_id: 'SP123.token' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFungibleToken')
        .mockReturnValueOnce('SP123.token');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
    });
  });

  describe('getAddressFtEvents', () => {
    it('should get address FT events successfully', async () => {
      const mockResponse = { events: [{ event_type: 'ft_transfer' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressFtEvents')
        .mockReturnValueOnce('SP123ABC')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
    });
  });

  describe('getFungibleTokenMetadata', () => {
    it('should get fungible token metadata successfully', async () => {
      const mockResponse = { results: [{ name: 'Token', symbol: 'TKN' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFungibleTokenMetadata')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFungibleTokensOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ 
        json: mockResponse, 
        pairedItem: { item: 0 } 
      }]);
    });
  });
});

describe('Stacking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.hiro.so' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get PoX info successfully', async () => {
    const mockResponse = {
      contract_id: 'SP000000000000000000002Q6VF78.pox',
      current_cycle: { id: 123, is_pox_active: true },
    };
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getPoxInfo');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get reward slot holders successfully', async () => {
    const mockResponse = {
      limit: 96,
      offset: 0,
      results: [{ canonical: true, burn_block_hash: 'hash123' }],
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRewardSlotHolders')
      .mockReturnValueOnce(800000)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('reward_slot_holders/800000'),
      })
    );
  });

  it('should get burnchain rewards successfully', async () => {
    const mockResponse = {
      limit: 20,
      offset: 0,
      results: [{ canonical: true, burn_block_hash: 'hash123', reward_recipient: 'address123' }],
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBurnchainRewards')
      .mockReturnValueOnce('SP1234567890ABCDEF')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(0);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('rewards/SP1234567890ABCDEF'),
      })
    );
  });

  it('should get all reward slot holders successfully', async () => {
    const mockResponse = {
      limit: 96,
      offset: 0,
      results: [{ canonical: true, burn_block_hash: 'hash123' }],
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllRewardSlotHolders')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(10);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('reward_slot_holders?limit=100&offset=10'),
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getPoxInfo');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(executeStackingOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow(
      'Unknown operation: unknownOperation'
    );
  });
});

describe('Names Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.hiro.so' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('getName - success', async () => {
    const mockResponse = { 
      name: 'example.btc',
      address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      blockchain: 'stacks',
      expire_block: 123456
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getName')
      .mockReturnValueOnce('example.btc');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getNamesByBitcoinAddress - success', async () => {
    const mockResponse = { 
      names: ['example1.btc', 'example2.btc'] 
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNamesByBitcoinAddress')
      .mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getNamesByStacksAddress - success', async () => {
    const mockResponse = { 
      names: ['example1.btc', 'example2.btc'] 
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNamesByStacksAddress')
      .mockReturnValueOnce('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getNamespaces - success', async () => {
    const mockResponse = { 
      namespaces: ['btc', 'id', 'app'] 
    };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getNamespaces');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getNamespaceNames - success', async () => {
    const mockResponse = { 
      names: ['name1.btc', 'name2.btc'],
      total: 2,
      page: 0
    };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNamespaceNames')
      .mockReturnValueOnce('btc')
      .mockReturnValueOnce(0);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('error handling', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getName');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });

  test('continue on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getName');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeNamesOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
