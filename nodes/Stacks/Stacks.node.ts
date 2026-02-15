/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-stacks/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Stacks implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stacks',
    name: 'stacks',
    icon: 'file:stacks.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Stacks API',
    defaults: {
      name: 'Stacks',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'stacksApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'TokensAndAssets',
            value: 'tokensAndAssets',
          },
          {
            name: 'NetworkInfo',
            value: 'networkInfo',
          },
          {
            name: 'Microblocks',
            value: 'microblocks',
          }
        ],
        default: 'blocks',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Latest Block',
      value: 'getLatestBlock',
      description: 'Get the most recent block',
      action: 'Get latest block',
    },
    {
      name: 'Get Block by Hash',
      value: 'getBlockByHash',
      description: 'Get block by hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get Block by Height',
      value: 'getBlockByHeight',
      description: 'Get block by height',
      action: 'Get block by height',
    },
    {
      name: 'List Blocks',
      value: 'listBlocks',
      description: 'Get list of recent blocks',
      action: 'List blocks',
    },
  ],
  default: 'getLatestBlock',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'List Transactions',
      value: 'listTransactions',
      description: 'Get recent transactions',
      action: 'List transactions',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get transaction by ID',
      action: 'Get transaction',
    },
    {
      name: 'Broadcast Transaction',
      value: 'broadcastTransaction',
      description: 'Broadcast a transaction',
      action: 'Broadcast transaction',
    },
    {
      name: 'Get Mempool Transactions',
      value: 'getMempoolTransactions',
      description: 'Get pending transactions',
      action: 'Get mempool transactions',
    },
    {
      name: 'Get Address Transactions',
      value: 'getAddressTransactions',
      description: 'Get transactions for address',
      action: 'Get address transactions',
    },
  ],
  default: 'listTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Account Balance',
      value: 'getAccountBalance',
      description: 'Get account STX and token balances',
      action: 'Get account balance',
    },
    {
      name: 'Get Account STX Balance',
      value: 'getAccountSTXBalance',
      description: 'Get account STX balance details',
      action: 'Get account STX balance',
    },
    {
      name: 'Get Account Assets',
      value: 'getAccountAssets',
      description: 'Get account asset holdings',
      action: 'Get account assets',
    },
    {
      name: 'Get Account Nonces',
      value: 'getAccountNonces',
      description: 'Get account nonce information',
      action: 'Get account nonces',
    },
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get core account information',
      action: 'Get account info',
    },
  ],
  default: 'getAccountBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Get Contract Info',
      value: 'getContractInfo',
      description: 'Get contract information',
      action: 'Get contract info',
    },
    {
      name: 'Call Read Only Function',
      value: 'callReadOnlyFunction',
      description: 'Execute read-only contract function',
      action: 'Call read only function',
    },
    {
      name: 'Get Contract Events',
      value: 'getContractEvents',
      description: 'Get contract events',
      action: 'Get contract events',
    },
    {
      name: 'Get Contract Source',
      value: 'getContractSource',
      description: 'Get contract source code',
      action: 'Get contract source',
    },
    {
      name: 'Get Contract Details',
      value: 'getContractDetails',
      description: 'Get detailed contract information',
      action: 'Get contract details',
    },
  ],
  default: 'getContractInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokensAndAssets'],
    },
  },
  options: [
    {
      name: 'List Fungible Tokens',
      value: 'listFungibleTokens',
      description: 'Get fungible token metadata',
      action: 'List fungible tokens',
    },
    {
      name: 'List Non-Fungible Tokens',
      value: 'listNonFungibleTokens',
      description: 'Get NFT collections',
      action: 'List non-fungible tokens',
    },
    {
      name: 'Get NFT Holdings',
      value: 'getNFTHoldings',
      description: 'Get NFT holdings for address',
      action: 'Get NFT holdings',
    },
    {
      name: 'Get Fungible Token Metadata',
      value: 'getFungibleTokenMetadata',
      description: 'Get FT metadata',
      action: 'Get fungible token metadata',
    },
    {
      name: 'Get NFT Mints',
      value: 'getNFTMints',
      description: 'Get NFT mint events',
      action: 'Get NFT mints',
    },
  ],
  default: 'listFungibleTokens',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['networkInfo'],
		},
	},
	options: [
		{
			name: 'Get Network Info',
			value: 'getNetworkInfo',
			description: 'Get core network information',
			action: 'Get network info',
		},
		{
			name: 'Get Network Status',
			value: 'getNetworkStatus',
			description: 'Get extended network status',
			action: 'Get network status',
		},
		{
			name: 'Get Transfer Fees',
			value: 'getTransferFees',
			description: 'Get current transfer fee estimates',
			action: 'Get transfer fees',
		},
		{
			name: 'Get Fee Rates',
			value: 'getFeeRates',
			description: 'Get current fee rate information',
			action: 'Get fee rates',
		},
		{
			name: 'Get Network Stats',
			value: 'getNetworkStats',
			description: 'Get network statistics',
			action: 'Get network stats',
		},
	],
	default: 'getNetworkInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['microblocks'],
    },
  },
  options: [
    {
      name: 'Get Latest Microblocks',
      value: 'getLatestMicroblocks',
      description: 'Get recent microblocks',
      action: 'Get latest microblocks',
    },
    {
      name: 'Get Microblock By Hash',
      value: 'getMicroblockByHash',
      description: 'Get microblock by hash',
      action: 'Get microblock by hash',
    },
    {
      name: 'Get Unanchored Transactions',
      value: 'getUnanchoredTransactions',
      description: 'Get unanchored transactions',
      action: 'Get unanchored transactions',
    },
  ],
  default: 'getLatestMicroblocks',
},
      // Parameter definitions
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'The block hash (hexadecimal format)',
  placeholder: '0x...',
},
{
  displayName: 'Block Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHeight'],
    },
  },
  default: 0,
  description: 'The block height',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['listBlocks'],
    },
  },
  default: 20,
  description: 'Maximum number of blocks to return',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['listBlocks'],
    },
  },
  default: 0,
  description: 'Index of first block to return',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions', 'getMempoolTransactions', 'getAddressTransactions'],
    },
  },
  default: 20,
  description: 'Number of transactions to return',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions', 'getMempoolTransactions', 'getAddressTransactions'],
    },
  },
  default: 0,
  description: 'Number of transactions to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Coinbase',
      value: 'coinbase',
    },
    {
      name: 'Token Transfer',
      value: 'token_transfer',
    },
    {
      name: 'Smart Contract',
      value: 'smart_contract',
    },
    {
      name: 'Contract Call',
      value: 'contract_call',
    },
    {
      name: 'Poison Microblock',
      value: 'poison_microblock',
    },
  ],
  default: '',
  description: 'Filter transactions by type',
},
{
  displayName: 'Transaction ID',
  name: 'txId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction'],
    },
  },
  default: '',
  description: 'The transaction ID to retrieve',
  placeholder: '0x...',
},
{
  displayName: 'Transaction Data',
  name: 'transactionData',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['broadcastTransaction'],
    },
  },
  default: '',
  description: 'Hexadecimal-encoded transaction data',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAddressTransactions'],
    },
  },
  default: '',
  description: 'The Stacks address to get transactions for',
  placeholder: 'SP...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountBalance'],
    },
  },
  default: '',
  description: 'The Stacks address to get balances for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountSTXBalance'],
    },
  },
  default: '',
  description: 'The Stacks address to get STX balance for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountAssets'],
    },
  },
  default: '',
  description: 'The Stacks address to get asset holdings for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountNonces'],
    },
  },
  default: '',
  description: 'The Stacks address to get nonce information for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountInfo'],
    },
  },
  default: '',
  description: 'The Stacks address to get core account information for',
},
{
  displayName: 'Contract ID',
  name: 'contractId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractInfo'],
    },
  },
  default: '',
  description: 'The contract identifier',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction', 'getContractEvents', 'getContractSource', 'getContractDetails'],
    },
  },
  default: '',
  description: 'The contract address',
},
{
  displayName: 'Contract Name',
  name: 'contractName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction', 'getContractEvents', 'getContractSource', 'getContractDetails'],
    },
  },
  default: '',
  description: 'The contract name',
},
{
  displayName: 'Function Name',
  name: 'functionName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction'],
    },
  },
  default: '',
  description: 'The function name to call',
},
{
  displayName: 'Arguments',
  name: 'arguments',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction'],
    },
  },
  default: '[]',
  description: 'Function arguments as JSON array',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractEvents'],
    },
  },
  default: 50,
  description: 'Maximum number of events to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractEvents'],
    },
  },
  default: 0,
  description: 'Number of events to skip',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokensAndAssets'],
      operation: ['listFungibleTokens', 'listNonFungibleTokens', 'getNFTHoldings', 'getNFTMints'],
    },
  },
  default: 20,
  description: 'Maximum number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokensAndAssets'],
      operation: ['listFungibleTokens', 'listNonFungibleTokens', 'getNFTHoldings', 'getNFTMints'],
    },
  },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokensAndAssets'],
      operation: ['getNFTHoldings'],
    },
  },
  default: '',
  description: 'The Stacks address to get NFT holdings for',
},
{
  displayName: 'Contract ID',
  name: 'contractId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokensAndAssets'],
      operation: ['getFungibleTokenMetadata'],
    },
  },
  default: '',
  description: 'The contract identifier for the fungible token',
},
// No additional parameters required - all endpoints take no parameters,
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['microblocks'],
      operation: ['getLatestMicroblocks'],
    },
  },
  default: 20,
  description: 'Max number of microblocks to fetch',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['microblocks'],
      operation: ['getLatestMicroblocks'],
    },
  },
  default: 0,
  description: 'Index of first microblock to fetch',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Microblock Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['microblocks'],
      operation: ['getMicroblockByHash'],
    },
  },
  default: '',
  description: 'Hash of the microblock to retrieve',
  placeholder: '0x...',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['microblocks'],
      operation: ['getUnanchoredTransactions'],
    },
  },
  default: 20,
  description: 'Max number of unanchored transactions to fetch',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['microblocks'],
      operation: ['getUnanchoredTransactions'],
    },
  },
  default: 0,
  description: 'Index of first transaction to fetch',
  typeOptions: {
    minValue: 0,
  },
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'tokensAndAssets':
        return [await executeTokensAndAssetsOperations.call(this, items)];
      case 'networkInfo':
        return [await executeNetworkInfoOperations.call(this, items)];
      case 'microblocks':
        return [await executeMicroblocksOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLatestBlock': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/block`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          if (!hash) {
            throw new NodeOperationError(this.getNode(), 'Block hash is required');
          }
          
          // Validate hash format (should be hexadecimal)
          if (!/^0x[a-fA-F0-9]+$/.test(hash)) {
            throw new NodeOperationError(this.getNode(), 'Block hash must be in hexadecimal format (0x...)');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/block/${hash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          
          if (height < 0) {
            throw new NodeOperationError(this.getNode(), 'Block height must be a non-negative number');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/block/by_height/${height}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listBlocks': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams();
          if (limit !== 20) queryParams.append('limit', limit.toString());
          if (offset !== 0) queryParams.append('offset', offset.toString());

          const queryString = queryParams.toString();
          const url = queryString 
            ? `${credentials.baseUrl}/extended/v1/block?${queryString}`
            : `${credentials.baseUrl}/extended/v1/block`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response?.status === 404) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Block not found',
            description: 'The requested block could not be found',
          });
        }
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const type = this.getNodeParameter('type', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (type) {
            queryParams.type = type;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tx?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const txId = this.getNodeParameter('txId', i) as string;

          if (!txId.startsWith('0x')) {
            throw new NodeOperationError(this.getNode(), 'Transaction ID must start with 0x');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tx/${txId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'broadcastTransaction': {
          const transactionData = this.getNodeParameter('transactionData', i) as string;

          if (!transactionData.startsWith('0x')) {
            throw new NodeOperationError(this.getNode(), 'Transaction data must be hexadecimal-encoded and start with 0x');
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/octet-stream',
            },
            body: transactionData,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMempoolTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tx/mempool?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (!address.startsWith('SP') && !address.startsWith('SM')) {
            throw new NodeOperationError(this.getNode(), 'Invalid Stacks address format. Address must start with SP or SM');
          }

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/transactions?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function validateStacksAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Basic Stacks address validation - starts with SP or SM and is proper length
  const stacksAddressRegex = /^S[PM][0-9A-HJKMNP-TV-Z]{39}$/;
  return stacksAddressRegex.test(address);
}

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAccountBalance': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/balances`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountSTXBalance': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/stx`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountAssets': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/assets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountNonces': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/nonces`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountInfo': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/accounts/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeSmartContractsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getContractInfo': {
          const contractId = this.getNodeParameter('contractId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/contract/${contractId}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'callReadOnlyFunction': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;
          const functionName = this.getNodeParameter('functionName', i) as string;
          const argumentsParam = this.getNodeParameter('arguments', i) as string;

          let parsedArguments: any[] = [];
          try {
            parsedArguments = JSON.parse(argumentsParam);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid arguments JSON: ${error.message}`);
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              sender: contractAddress,
              arguments: parsedArguments,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractEvents': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/contract/${contractAddress}/${contractName}/events?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractSource': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/contracts/source/${contractAddress}/${contractName}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractDetails': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/contract/${contractAddress}/${contractName}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function validateStacksAddress(address: string): boolean {
  // Basic Stacks address validation (starts with SP or SM for mainnet, ST for testnet)
  return /^(SP|SM|ST)[0-9A-HJKMNP-TV-Z]{38}$/.test(address);
}

async function executeTokensAndAssetsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listFungibleTokens': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/ft`,
            qs: {
              limit,
              offset,
            },
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listNonFungibleTokens': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/nft`,
            qs: {
              limit,
              offset,
            },
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNFTHoldings': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          if (!validateStacksAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid Stacks address: ${address}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/nft/holdings`,
            qs: {
              address,
              limit,
              offset,
            },
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFungibleTokenMetadata': {
          const contractId = this.getNodeParameter('contractId', i) as string;

          if (!contractId || !contractId.includes('.')) {
            throw new NodeOperationError(this.getNode(), `Invalid contract ID format: ${contractId}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/ft/metadata`,
            qs: {
              contract_id: contractId,
            },
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNFTMints': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/nft/mints`,
            qs: {
              limit,
              offset,
            },
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeNetworkInfoOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('stacksApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			
			switch (operation) {
				case 'getNetworkInfo': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/info`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNetworkStatus': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/extended/v1/status`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransferFees': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/fees/transfer`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFeeRates': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/extended/v1/fee_rate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNetworkStats': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/extended/v1/stats`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw new NodeApiError(
					this.getNode(),
					error,
					{ itemIndex: i },
				);
			}
		}
	}

	return returnData;
}

function validateHexHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

async function executeMicroblocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLatestMicroblocks': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const queryParams: string[] = [];
          if (limit !== 20) queryParams.push(`limit=${limit}`);
          if (offset !== 0) queryParams.push(`offset=${offset}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/microblock${queryString}`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMicroblockByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          if (!hash) {
            throw new NodeOperationError(this.getNode(), 'Microblock hash is required');
          }

          if (!validateHexHash(hash)) {
            throw new NodeOperationError(this.getNode(), 'Invalid microblock hash format. Must be a 64-character hex string starting with 0x');
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/microblock/${hash}`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUnanchoredTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const queryParams: string[] = [];
          if (limit !== 20) queryParams.push(`limit=${limit}`);
          if (offset !== 0) queryParams.push(`offset=${offset}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/microblock/unanchored/txs${queryString}`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}
