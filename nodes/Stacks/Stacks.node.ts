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
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'unknown',
            value: 'unknown',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'NonFungibleTokens',
            value: 'nonFungibleTokens',
          },
          {
            name: 'Stacking',
            value: 'stacking',
          },
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'Names',
            value: 'names',
          },
          {
            name: 'FungibleTokens',
            value: 'fungibleTokens',
          }
        ],
        default: 'transactions',
      },
      // Operation dropdowns per resource
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
      name: 'Get All Transactions',
      value: 'getAllTransactions',
      description: 'Get recent transactions',
      action: 'Get all transactions',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get transaction by ID',
      action: 'Get transaction by ID',
    },
    {
      name: 'Get Mempool Transactions',
      value: 'getMempoolTransactions',
      description: 'Get pending transactions',
      action: 'Get mempool transactions',
    },
    {
      name: 'Broadcast Transaction',
      value: 'broadcastTransaction',
      description: 'Broadcast signed transaction',
      action: 'Broadcast transaction',
    },
    {
      name: 'Get Address Transactions',
      value: 'getAddressTransactions',
      description: 'Get transactions for address',
      action: 'Get address transactions',
    },
  ],
  default: 'getAllTransactions',
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
      description: 'Get STX and token balances for an account',
      action: 'Get account balance',
    },
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get account nonce and balance',
      action: 'Get account info',
    },
    {
      name: 'Get STX Inbound',
      value: 'getStxInbound',
      description: 'Get STX received by address',
      action: 'Get STX inbound',
    },
    {
      name: 'Get Account Assets',
      value: 'getAccountAssets',
      description: 'Get fungible and non-fungible tokens for an account',
      action: 'Get account assets',
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
      name: 'Get Contract Details',
      value: 'getContract',
      description: 'Get contract details and metadata',
      action: 'Get contract details',
    },
    {
      name: 'Call Read-Only Function',
      value: 'callReadOnlyFunction',
      description: 'Call a read-only contract function',
      action: 'Call read-only function',
    },
    {
      name: 'Get Contract Events',
      value: 'getContractEvents',
      description: 'Get events emitted by a contract',
      action: 'Get contract events',
    },
    {
      name: 'Get Contract Source',
      value: 'getContractSource',
      description: 'Get contract source code',
      action: 'Get contract source',
    },
  ],
  default: 'getContract',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
    },
  },
  options: [
    {
      name: 'Get All NFT Holdings',
      value: 'getAllNftHoldings',
      description: 'Get all NFT holdings',
      action: 'Get all NFT holdings',
    },
    {
      name: 'Get NFT Events',
      value: 'getNftEvents',
      description: 'Get NFT events for address',
      action: 'Get NFT events for address',
    },
    {
      name: 'Get NFT Mints',
      value: 'getNftMints',
      description: 'Get NFT mint events',
      action: 'Get NFT mint events',
    },
    {
      name: 'Get NFT History',
      value: 'getNftHistory',
      description: 'Get NFT transaction history',
      action: 'Get NFT transaction history',
    },
  ],
  default: 'getAllNftHoldings',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['stacking'],
    },
  },
  options: [
    {
      name: 'Get Stacking Rewards',
      value: 'getStackingRewards',
      description: 'Get stacking rewards for a specific address',
      action: 'Get stacking rewards for address',
    },
    {
      name: 'Get All Stacking Rewards',
      value: 'getAllStackingRewards',
      description: 'Get all stacking rewards',
      action: 'Get all stacking rewards',
    },
    {
      name: 'Get PoX Info',
      value: 'getPoxInfo',
      description: 'Get current PoX (stacking) cycle information',
      action: 'Get PoX info',
    },
    {
      name: 'Get Total Stacking Rewards',
      value: 'getTotalStackingRewards',
      description: 'Get total stacking rewards across all cycles',
      action: 'Get total stacking rewards',
    },
  ],
  default: 'getStackingRewards',
},
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
      name: 'Get Recent Blocks',
      value: 'getBlocks',
      description: 'Get recent blocks',
      action: 'Get recent blocks',
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
      name: 'Get Block Transactions',
      value: 'getBlockTransactions',
      description: 'Get transactions in block',
      action: 'Get block transactions',
    },
  ],
  default: 'getBlocks',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['names'],
    },
  },
  options: [
    {
      name: 'Get Name Info',
      value: 'getNameInfo',
      description: 'Get name registration details',
      action: 'Get name registration details',
    },
    {
      name: 'Get Names By Address',
      value: 'getNamesByAddress',
      description: 'Get names owned by address',
      action: 'Get names owned by address',
    },
    {
      name: 'Get All Namespaces',
      value: 'getAllNamespaces',
      description: 'Get all namespaces',
      action: 'Get all namespaces',
    },
    {
      name: 'Get All Names',
      value: 'getAllNames',
      description: 'Get all registered names',
      action: 'Get all registered names',
    },
    {
      name: 'Get Subdomain Info',
      value: 'getSubdomainInfo',
      description: 'Get subdomain information',
      action: 'Get subdomain information',
    },
  ],
  default: 'getNameInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
    },
  },
  options: [
    {
      name: 'Get Fungible Token Metadata',
      value: 'getFtMetadata',
      description: 'Get fungible token metadata',
      action: 'Get fungible token metadata',
    },
    {
      name: 'Get All Fungible Tokens',
      value: 'getAllFungibleTokens',
      description: 'Get all fungible tokens',
      action: 'Get all fungible tokens',
    },
    {
      name: 'Get Fungible Token Events',
      value: 'getFtEvents',
      description: 'Get fungible token events for address',
      action: 'Get fungible token events',
    },
    {
      name: 'Get Token Supply',
      value: 'getFtSupply',
      description: 'Get token supply information',
      action: 'Get token supply',
    },
  ],
  default: 'getFtMetadata',
},
      // Parameter definitions
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAllTransactions', 'getMempoolTransactions', 'getAddressTransactions'],
    },
  },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAllTransactions', 'getMempoolTransactions', 'getAddressTransactions'],
    },
  },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAllTransactions'],
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
  description: 'Filter by transaction type',
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
  description: 'The serialized transaction data to broadcast',
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
  description: 'The address to get transactions for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountBalance', 'getAccountInfo', 'getStxInbound', 'getAccountAssets'],
    },
  },
  default: '',
  description: 'The Stacks account address',
  placeholder: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getStxInbound', 'getAccountAssets'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
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
      resource: ['accounts'],
      operation: ['getStxInbound', 'getAccountAssets'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContract', 'callReadOnlyFunction', 'getContractEvents', 'getContractSource'],
    },
  },
  default: '',
  description: 'The contract address (principal)',
},
{
  displayName: 'Contract Name',
  name: 'contractName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContract', 'callReadOnlyFunction', 'getContractEvents', 'getContractSource'],
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
  description: 'The name of the function to call',
},
{
  displayName: 'Arguments',
  name: 'arguments',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction'],
    },
  },
  default: '[]',
  description: 'Arguments to pass to the function as JSON array',
},
{
  displayName: 'Sender Address',
  name: 'sender',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callReadOnlyFunction'],
    },
  },
  default: '',
  description: 'The sender address for the function call (optional)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractEvents'],
    },
  },
  default: 100,
  description: 'Number of events to return (max 200)',
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
      resource: ['smartContracts'],
      operation: ['getContractEvents'],
    },
  },
  default: 0,
  description: 'Number of events to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Mainnet',
      value: 'mainnet',
    },
    {
      name: 'Testnet',
      value: 'testnet',
    },
  ],
  default: 'mainnet',
  description: 'The network to use',
},
{
  displayName: 'Asset Identifiers',
  name: 'assetIdentifiers',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getAllNftHoldings'],
    },
  },
  default: '',
  description: 'Comma-separated list of asset identifiers to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getAllNftHoldings'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getAllNftHoldings'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftEvents'],
    },
  },
  default: '',
  description: 'The address to get NFT events for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftEvents'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftEvents'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Asset Identifier',
  name: 'assetIdentifier',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftMints'],
    },
  },
  default: '',
  description: 'Asset identifier to filter mint events',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftMints'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftMints'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Asset Identifier',
  name: 'assetIdentifier',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftHistory'],
    },
  },
  default: '',
  description: 'Asset identifier to filter transaction history',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftHistory'],
    },
  },
  default: '',
  description: 'Token value to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftHistory'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getNftHistory'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['stacking'],
      operation: ['getStackingRewards'],
    },
  },
  default: '',
  description: 'The STX address to get stacking rewards for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['stacking'],
      operation: ['getStackingRewards', 'getAllStackingRewards'],
    },
  },
  default: 20,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['stacking'],
      operation: ['getStackingRewards', 'getAllStackingRewards'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks', 'getBlockTransactions'],
    },
  },
  default: 20,
  description: 'Number of results to return',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks', 'getBlockTransactions'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash', 'getBlockTransactions'],
    },
  },
  default: '',
  description: 'The block hash',
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
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNameInfo'],
    },
  },
  default: '',
  description: 'The name to lookup registration details for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNamesByAddress'],
    },
  },
  default: '',
  description: 'The Bitcoin address to get names for',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getAllNames'],
    },
  },
  default: 0,
  description: 'Page number for pagination',
},
{
  displayName: 'Subdomain',
  name: 'subdomain',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getSubdomainInfo'],
    },
  },
  default: '',
  description: 'The subdomain to get information for',
},
{
  displayName: 'Contract ID',
  name: 'contractId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getFtMetadata'],
    },
  },
  default: '',
  description: 'The contract identifier for the fungible token',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getAllFungibleTokens'],
    },
  },
  default: 96,
  description: 'Max number of tokens to fetch',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getAllFungibleTokens'],
    },
  },
  default: 0,
  description: 'Index of first token to fetch',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getFtEvents'],
    },
  },
  default: '',
  description: 'The address to get fungible token events for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getFtEvents'],
    },
  },
  default: 96,
  description: 'Max number of events to fetch',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getFtEvents'],
    },
  },
  default: 0,
  description: 'Index of first event to fetch',
},
{
  displayName: 'Contract ID',
  name: 'contractId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fungibleTokens'],
      operation: ['getFtSupply'],
    },
  },
  default: '',
  description: 'The contract identifier for the fungible token',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'nonFungibleTokens':
        return [await executeNonFungibleTokensOperations.call(this, items)];
      case 'stacking':
        return [await executeStackingOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'names':
        return [await executeNamesOperations.call(this, items)];
      case 'fungibleTokens':
        return [await executeFungibleTokensOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  let credentials: any = {};
  try {
    credentials = await this.getCredentials('stacksApi') as any;
  } catch (error: any) {
    // Use default base URL if no credentials
    credentials = {
      baseUrl: 'https://api.mainnet.hiro.so',
      apiKey: '',
    };
  }

  const baseUrl = credentials.baseUrl || 'https://api.mainnet.hiro.so';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllTransactions': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const type = this.getNodeParameter('type', i, '') as string;

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
            url: `${baseUrl}/extended/v1/tx?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const txId = this.getNodeParameter('txId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/tx/${txId}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMempoolTransactions': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/tx/mempool?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'broadcastTransaction': {
          const transactionData = this.getNodeParameter('transactionData', i) as string;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v2/transactions`,
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: transactionData,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${address}/transactions?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { 
            error: error.message,
            operation,
            itemIndex: i,
          },
          pairedItem: { item: i },
        });
      } else {
        if (error instanceof NodeApiError || error instanceof NodeOperationError) {
          throw error;
        }
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let options: any = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };

      // Try to get credentials for potential API key (optional for public API)
      try {
        const credentials = await this.getCredentials('stacksApi') as any;
        if (credentials.apiKey) {
          options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
        }
        if (credentials.baseUrl) {
          options.baseUrl = credentials.baseUrl;
        } else {
          options.baseUrl = 'https://api.mainnet.hiro.so';
        }
      } catch (error: any) {
        // No credentials configured, use default mainnet URL
        options.baseUrl = 'https://api.mainnet.hiro.so';
      }

      switch (operation) {
        case 'getAccountBalance': {
          const address = this.getNodeParameter('address', i) as string;
          options.url = `${options.baseUrl}/extended/v1/address/${address}/balances`;
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountInfo': {
          const address = this.getNodeParameter('address', i) as string;
          options.url = `${options.baseUrl}/v2/accounts/${address}`;
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStxInbound': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          
          options.url = `${options.baseUrl}/extended/v1/address/${address}/stx_inbound?${queryParams.toString()}`;
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountAssets': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          
          options.url = `${options.baseUrl}/extended/v1/address/${address}/assets?${queryParams.toString()}`;
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
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
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

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const network = this.getNodeParameter('network', i) as string;
      const baseUrl = network === 'testnet' 
        ? 'https://api.testnet.hiro.so' 
        : 'https://api.mainnet.hiro.so';

      switch (operation) {
        case 'getContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/contract/${contractAddress}.${contractName}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'callReadOnlyFunction': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;
          const functionName = this.getNodeParameter('functionName', i) as string;
          const argumentsParam = this.getNodeParameter('arguments', i, '[]') as string;
          const sender = this.getNodeParameter('sender', i, '') as string;

          let parsedArguments: any[];
          try {
            parsedArguments = JSON.parse(argumentsParam);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in arguments parameter');
          }

          const body: any = {
            arguments: parsedArguments,
          };

          if (sender) {
            body.sender = sender;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractEvents': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractName = this.getNodeParameter('contractName', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/contract/${contractAddress}.${contractName}/events?${queryParams}`,
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
            url: `${baseUrl}/v2/contracts/source/${contractAddress}/${contractName}`,
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

async function executeNonFungibleTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('stacksApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials?.baseUrl || 'https://api.mainnet.hiro.so';

      switch (operation) {
        case 'getAllNftHoldings': {
          const assetIdentifiers = this.getNodeParameter('assetIdentifiers', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {};
          if (assetIdentifiers) {
            queryParams.asset_identifiers = assetIdentifiers;
          }
          if (limit) {
            queryParams.limit = limit.toString();
          }
          if (offset) {
            queryParams.offset = offset.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${baseUrl}/extended/v1/tokens/nft/holdings${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNftEvents': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {};
          if (limit) {
            queryParams.limit = limit.toString();
          }
          if (offset) {
            queryParams.offset = offset.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${baseUrl}/extended/v1/address/${address}/nft_events${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNftMints': {
          const assetIdentifier = this.getNodeParameter('assetIdentifier', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {};
          if (assetIdentifier) {
            queryParams.asset_identifier = assetIdentifier;
          }
          if (limit) {
            queryParams.limit = limit.toString();
          }
          if (offset) {
            queryParams.offset = offset.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${baseUrl}/extended/v1/tokens/nft/mints${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNftHistory': {
          const assetIdentifier = this.getNodeParameter('assetIdentifier', i, '') as string;
          const value = this.getNodeParameter('value', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {};
          if (assetIdentifier) {
            queryParams.asset_identifier = assetIdentifier;
          }
          if (value) {
            queryParams.value = value;
          }
          if (limit) {
            queryParams.limit = limit.toString();
          }
          if (offset) {
            queryParams.offset = offset.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${baseUrl}/extended/v1/tokens/nft/history${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers['X-API-Key'] = credentials.apiKey;
          }

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
        if (error.cause?.response?.status) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeStackingOperations(
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
        case 'getStackingRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/burnchain/reward_slot_holders/${address}`,
            qs: {
              limit,
              offset,
            },
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllStackingRewards': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/burnchain/rewards`,
            qs: {
              limit,
              offset,
            },
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPoxInfo': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/pox`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTotalStackingRewards': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/burnchain/rewards/total`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

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
          json: { 
            error: error.message,
            operation,
          }, 
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

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  // Get credentials (optional for public API)
  let credentials: any = null;
  try {
    credentials = await this.getCredentials('stacksApi') as any;
  } catch (error: any) {
    // Credentials are optional for public API access
  }

  const baseUrl = credentials?.baseUrl || 'https://api.mainnet.hiro.so';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBlocks': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/block`,
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers = {
              'X-API-Key': credentials.apiKey,
            };
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/block/${hash}`,
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers = {
              'X-API-Key': credentials.apiKey,
            };
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/block/by_height/${height}`,
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers = {
              'X-API-Key': credentials.apiKey,
            };
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockTransactions': {
          const hash = this.getNodeParameter('hash', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/block/${hash}/transactions`,
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          if (credentials?.apiKey) {
            options.headers = {
              'X-API-Key': credentials.apiKey,
            };
          }

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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeNamesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  
  let credentials: any = {};
  try {
    credentials = await this.getCredentials('stacksApi') as any;
  } catch (error: any) {
    // Use default base URL if no credentials provided
    credentials = {
      baseUrl: 'https://api.mainnet.hiro.so',
      apiKey: '',
    };
  }

  const baseUrl = credentials.baseUrl || 'https://api.mainnet.hiro.so';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getNameInfo': {
          const name = this.getNodeParameter('name', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/names/${encodeURIComponent(name)}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNamesByAddress': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/addresses/bitcoin/${encodeURIComponent(address)}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllNamespaces': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/namespaces`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllNames': {
          const page = this.getNodeParameter('page', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/names`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (page > 0) {
            options.url += `?page=${page}`;
          }

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubdomainInfo': {
          const subdomain = this.getNodeParameter('subdomain', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/subdomains/${encodeURIComponent(subdomain)}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

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

async function executeFungibleTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  let credentials: any = {};
  try {
    credentials = await this.getCredentials('stacksApi') as any;
  } catch (error: any) {
    // Use default values if no credentials provided
    credentials = {
      baseUrl: 'https://api.mainnet.hiro.so',
      apiKey: '',
    };
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getFtMetadata': {
          const contractId = this.getNodeParameter('contractId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/ft/metadata`,
            qs: {
              contract_id: contractId,
            },
            headers: {},
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllFungibleTokens': {
          const limit = this.getNodeParameter('limit', i, 96) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/ft`,
            qs: {
              limit,
              offset,
            },
            headers: {},
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFtEvents': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 96) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/address/${address}/ft_events`,
            qs: {
              limit,
              offset,
            },
            headers: {},
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFtSupply': {
          const contractId = this.getNodeParameter('contractId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/extended/v1/tokens/ft/${contractId}/supply`,
            headers: {},
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        } else {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
    }
  }

  return returnData;
}
