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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'Smart Contracts',
            value: 'smartContracts',
          },
          {
            name: 'NonFungibleTokens',
            value: 'nonFungibleTokens',
          },
          {
            name: 'FungibleTokens',
            value: 'fungibleTokens',
          },
          {
            name: 'Stacking',
            value: 'stacking',
          },
          {
            name: 'Names',
            value: 'names',
          }
        ],
        default: 'accounts',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['accounts'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account details and balances', action: 'Get account details and balances' },
    { name: 'Get Account Balances', value: 'getAccountBalances', description: 'Get STX and token balances', action: 'Get STX and token balances' },
    { name: 'Get Account STX', value: 'getAccountStx', description: 'Get STX balance and lock status', action: 'Get STX balance and lock status' },
    { name: 'Get Account Transactions', value: 'getAccountTransactions', description: 'Get account transaction history', action: 'Get account transaction history' },
    { name: 'Get Account Nonces', value: 'getAccountNonces', description: 'Get account nonce information', action: 'Get account nonce information' },
    { name: 'Get Account Balance', value: 'getAccountBalance', description: 'Get STX and token balances for an account', action: 'Get account balance' },
    { name: 'Get Account Info', value: 'getAccountInfo', description: 'Get account nonce and balance', action: 'Get account info' },
    { name: 'Get STX Inbound', value: 'getStxInbound', description: 'Get STX received by address', action: 'Get STX inbound' },
    { name: 'Get Account Assets', value: 'getAccountAssets', description: 'Get fungible and non-fungible tokens for an account', action: 'Get account assets' }
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transactions'] } },
  options: [
    { name: 'Get Transactions', value: 'getTransactions', description: 'Get recent transactions', action: 'Get transactions' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by ID', action: 'Get transaction by ID' },
    { name: 'Broadcast Transaction', value: 'broadcastTransaction', description: 'Broadcast a signed transaction', action: 'Broadcast transaction' },
    { name: 'Get Mempool Transactions', value: 'getMempoolTransactions', description: 'Get pending transactions', action: 'Get mempool transactions' },
    { name: 'Get Mempool Transaction', value: 'getMempoolTransaction', description: 'Get pending transaction by ID', action: 'Get mempool transaction by ID' },
    { name: 'Get Address Mempool Transactions', value: 'getAddressMempoolTransactions', description: 'Get pending transactions for address', action: 'Get address mempool transactions' },
    { name: 'Get All Transactions', value: 'getAllTransactions', description: 'Get recent transactions', action: 'Get all transactions' },
    { name: 'Get Address Transactions', value: 'getAddressTransactions', description: 'Get transactions for address', action: 'Get address transactions' }
  ],
  default: 'getTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['blocks'] } },
  options: [
    { name: 'Get Recent Blocks', value: 'getBlocks', description: 'Get recent blocks from the blockchain', action: 'Get recent blocks' },
    { name: 'Get Block by Hash or Height', value: 'getBlock', description: 'Get a specific block by hash or height', action: 'Get block by hash or height' },
    { name: 'Get Block Transactions', value: 'getBlockTransactions', description: 'Get all transactions in a specific block', action: 'Get block transactions' },
    { name: 'Get Network Info', value: 'getNetworkInfo', description: 'Get network and chain information', action: 'Get network info' },
    { name: 'Get PoX Info', value: 'getPoxInfo', description: 'Get Proof of Transfer cycle information', action: 'Get PoX info' },
    { name: 'Get Block by Hash', value: 'getBlockByHash', description: 'Get block by hash', action: 'Get block by hash' },
    { name: 'Get Block by Height', value: 'getBlockByHeight', description: 'Get block by height', action: 'Get block by height' }
  ],
  default: 'getBlocks',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['smartContracts'] } },
	options: [
		{ name: 'Get Contract', value: 'getContract', description: 'Get contract information', action: 'Get contract' },
		{ name: 'Get Contract Interface', value: 'getContractInterface', description: 'Get contract ABI', action: 'Get contract interface' },
		{ name: 'Call Read-Only Function', value: 'callReadOnlyFunction', description: 'Call read-only contract function', action: 'Call read-only function' },
		{ name: 'Get Contract Events', value: 'getContractEvents', description: 'Get contract events', action: 'Get contract events' },
		{ name: 'Get Contract Call', value: 'getContractCall', description: 'Get contract call details', action: 'Get contract call' },
		{ name: 'Get Contract Details', value: 'getContract', description: 'Get contract details and metadata', action: 'Get contract details' },
		{ name: 'Get Contract Source', value: 'getContractSource', description: 'Get contract source code', action: 'Get contract source' }
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
		{ name: 'Get NFT Holdings', value: 'getNftHoldings', description: 'Get NFT holdings for address', action: 'Get NFT holdings' },
		{ name: 'Get NFT History', value: 'getNftHistory', description: 'Get NFT transfer history', action: 'Get NFT history' },
		{ name: 'Get NFT Mints', value: 'getNftMints', description: 'Get NFT mint events', action: 'Get NFT mints' },
		{ name: 'Get Address NFT Events', value: 'getAddressNftEvents', description: 'Get NFT events for address', action: 'Get address NFT events' },
		{ name: 'Get All NFT Holdings', value: 'getAllNftHoldings', description: 'Get all NFT holdings', action: 'Get all NFT holdings' },
		{ name: 'Get NFT Events', value: 'getNftEvents', description: 'Get NFT events for address', action: 'Get NFT events for address' }
	],
	default: 'getNftHoldings',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['fungibleTokens'] } },
  options: [
    { name: 'Get Fungible Tokens', value: 'getFungibleTokens', description: 'Get fungible token metadata', action: 'Get fungible tokens' },
    { name: 'Get Fungible Token', value: 'getFungibleToken', description: 'Get specific token info', action: 'Get fungible token' },
    { name: 'Get Address FT Events', value: 'getAddressFtEvents', description: 'Get token events for address', action: 'Get address FT events' },
    { name: 'Get Fungible Token Metadata', value: 'getFungibleTokenMetadata', description: 'Get token metadata list', action: 'Get fungible token metadata' },
    { name: 'Get All Fungible Tokens', value: 'getAllFungibleTokens', description: 'Get all fungible tokens', action: 'Get all fungible tokens' },
    { name: 'Get Fungible Token Events', value: 'getFtEvents', description: 'Get fungible token events for address', action: 'Get fungible token events' },
    { name: 'Get Token Supply', value: 'getFtSupply', description: 'Get token supply information', action: 'Get token supply' }
  ],
  default: 'getFungibleTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['stacking'] } },
  options: [
    { name: 'Get PoX Info', value: 'getPoxInfo', description: 'Get current PoX cycle information', action: 'Get PoX info' },
    { name: 'Get Reward Slot Holders', value: 'getRewardSlotHolders', description: 'Get reward slot holders for a specific block height', action: 'Get reward slot holders' },
    { name: 'Get Burnchain Rewards', value: 'getBurnchainRewards', description: 'Get stacking rewards for a specific address', action: 'Get burnchain rewards' },
    { name: 'Get All Reward Slot Holders', value: 'getAllRewardSlotHolders', description: 'Get all reward slot holders', action: 'Get all reward slot holders' },
    { name: 'Get Stacking Rewards', value: 'getStackingRewards', description: 'Get stacking rewards for a specific address', action: 'Get stacking rewards for address' },
    { name: 'Get All Stacking Rewards', value: 'getAllStackingRewards', description: 'Get all stacking rewards', action: 'Get all stacking rewards' },
    { name: 'Get Total Stacking Rewards', value: 'getTotalStackingRewards', description: 'Get total stacking rewards across all cycles', action: 'Get total stacking rewards' }
  ],
  default: 'getPoxInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['names'] } },
  options: [
    { name: 'Get Name', value: 'getName', description: 'Get name information', action: 'Get name information' },
    { name: 'Get Names By Bitcoin Address', value: 'getNamesByBitcoinAddress', description: 'Get names owned by Bitcoin address', action: 'Get names by Bitcoin address' },
    { name: 'Get Names By Stacks Address', value: 'getNamesByStacksAddress', description: 'Get names owned by Stacks address', action: 'Get names by Stacks address' },
    { name: 'Get Namespaces', value: 'getNamespaces', description: 'Get all namespaces', action: 'Get all namespaces' },
    { name: 'Get Namespace Names', value: 'getNamespaceNames', description: 'Get names in namespace', action: 'Get names in namespace' },
    { name: 'Get Name Info', value: 'getNameInfo', description: 'Get name registration details', action: 'Get name registration details' },
    { name: 'Get Names By Address', value: 'getNamesByAddress', description: 'Get names owned by address', action: 'Get names owned by address' },
    { name: 'Get All Namespaces', value: 'getAllNamespaces', description: 'Get all namespaces', action: 'Get all namespaces' },
    { name: 'Get All Names', value: 'getAllNames', description: 'Get all registered names', action: 'Get all registered names' },
    { name: 'Get Subdomain Info', value: 'getSubdomainInfo', description: 'Get subdomain information', action: 'Get subdomain information' }
  ],
  default: 'getName',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccount'] } },
  default: '',
  description: 'The Stacks address or contract identifier',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountBalances'] } },
  default: '',
  description: 'The Stacks address or contract identifier',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountStx'] } },
  default: '',
  description: 'The Stacks address or contract identifier',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountTransactions'] } },
  default: '',
  description: 'The Stacks address or contract identifier',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountTransactions'] } },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountTransactions'] } },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accounts'], operation: ['getAccountNonces'] } },
  default: '',
  description: 'The Stacks address or contract identifier',
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
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransactions', 'getMempoolTransactions'] } },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransactions', 'getMempoolTransactions'] } },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransactions'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Coinbase', value: 'coinbase' },
    { name: 'Token Transfer', value: 'token_transfer' },
    { name: 'Smart Contract', value: 'smart_contract' },
    { name: 'Contract Call', value: 'contract_call' },
    { name: 'Poison Microblock', value: 'poison_microblock' },
  ],
  default: '',
  description: 'Filter by transaction type',
},
{
  displayName: 'Transaction ID',
  name: 'txId',
  type: 'string',
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransaction', 'getMempoolTransaction'] } },
  default: '',
  required: true,
  description: 'The transaction ID to retrieve',
},
{
  displayName: 'Transaction',
  name: 'transaction',
  type: 'string',
  displayOptions: { show: { resource: ['transactions'], operation: ['broadcastTransaction'] } },
  default: '',
  required: true,
  description: 'The signed transaction to broadcast (hex string)',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  displayOptions: { show: { resource: ['transactions'], operation: ['getAddressMempoolTransactions'] } },
  default: '',
  required: true,
  description: 'The Stacks address to get mempool transactions for',
},
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
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 20,
  description: 'Maximum number of blocks to return',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of blocks to skip',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
},
{
  displayName: 'Hash or Height',
  name: 'hashOrHeight',
  type: 'string',
  required: true,
  default: '',
  description: 'Block hash or height to retrieve',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlock', 'getBlockTransactions'],
    },
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
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContract'] } },
	default: '',
	description: 'The contract identifier',
},
{
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContractInterface'] } },
	default: '',
	description: 'The contract identifier',
},
{
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['callReadOnlyFunction'] } },
	default: '',
	description: 'The contract identifier',
},
{
	displayName: 'Function Name',
	name: 'functionName',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['callReadOnlyFunction'] } },
	default: '',
	description: 'The name of the function to call',
},
{
	displayName: 'Arguments',
	name: 'arguments',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['callReadOnlyFunction'] } },
	default: '',
	description: 'Function arguments as JSON string',
},
{
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContractEvents'] } },
	default: '',
	description: 'The contract identifier',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContractEvents'] } },
	default: 20,
	description: 'Number of events to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContractEvents'] } },
	default: 0,
	description: 'Number of events to skip',
},
{
	displayName: 'Transaction ID',
	name: 'txId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['smartContracts'], operation: ['getContractCall'] } },
	default: '',
	description: 'The transaction ID of the contract call',
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
	displayName: 'Principal',
	name: 'principal',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHoldings', 'getAddressNftEvents'],
		},
	},
	default: '',
	description: 'The Stacks address or contract identifier',
},
{
	displayName: 'Asset Identifiers',
	name: 'assetIdentifiers',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHoldings'],
		},
	},
	default: '',
	description: 'Comma-separated list of asset identifiers to filter by',
},
{
	displayName: 'Asset Identifier',
	name: 'assetIdentifier',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHistory', 'getNftMints'],
		},
	},
	default: '',
	description: 'The asset identifier for the NFT collection',
},
{
	displayName: 'Value',
	name: 'value',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHistory'],
		},
	},
	default: '',
	description: 'Hex string representing the NFT identifier',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHoldings', 'getNftHistory', 'getNftMints', 'getAddressNftEvents'],
		},
	},
	default: 50,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['nonFungibleTokens'],
			operation: ['getNftHoldings', 'getNftHistory', 'getNftMints', 'getAddressNftEvents'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
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
  displayName: 'Asset Identifier',
  name: 'assetIdentifier',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['nonFungibleTokens'],
      operation: ['getAllNftHoldings', 'getNftMints'],
    },
  },
  default: '',
  description: 'Asset identifier to filter mint events',
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
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getFungibleTokens'] } },
  default: 20,
  description: 'Number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getFungibleTokens'] } },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Contract ID',
  name: 'contractId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getFungibleToken'] } },
  default: '',
  description: 'The contract identifier for the fungible token',
},
{
  displayName: 'Principal',
  name: 'principal',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getAddressFtEvents'] } },
  default: '',
  description: 'The Stacks address to get token events for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getAddressFtEvents'] } },
  default: 20,
  description: 'Number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getAddressFtEvents'] } },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getFungibleTokenMetadata'] } },
  default: 20,
  description: 'Number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['fungibleTokens'], operation: ['getFungibleTokenMetadata'] } },
  default: 0,
  description: 'Number of results to skip',
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
      operation: ['getFtMetadata', 'getFtSupply'],
    },
  },
  default: '',
  description: 'The contract identifier for the fungible token',
},
{
  displayName: 'Block Height',
  name: 'blockHeight',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['stacking'], operation: ['getRewardSlotHolders'] } },
  default: 0,
  description: 'The block height to get reward slot holders for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['stacking'], operation: ['getBurnchainRewards'] } },
  default: '',
  description: 'The Stacks address to get burnchain rewards for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['stacking'], operation: ['getRewardSlotHolders', 'getBurnchainRewards', 'getAllRewardSlotHolders'] } },
  default: 96,
  description: 'Maximum number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['stacking'], operation: ['getRewardSlotHolders', 'getBurnchainRewards', 'getAllRewardSlotHolders'] } },
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
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'example.btc',
  description: 'The BNS name to get information for',
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getName'],
    },
  },
},
{
  displayName: 'Bitcoin Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  description: 'The Bitcoin address to get names for',
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNamesByBitcoinAddress'],
    },
  },
},
{
  displayName: 'Stacks Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  description: 'The Stacks address to get names for',
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNamesByStacksAddress'],
    },
  },
},
{
  displayName: 'Namespace',
  name: 'namespace',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'btc',
  description: 'The namespace to get names from',
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNamespaceNames'],
    },
  },
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  default: 0,
  description: 'Page number for pagination',
  displayOptions: {
    show: {
      resource: ['names'],
      operation: ['getNamespaceNames'],
    },
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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'nonFungibleTokens':
        return [await executeNonFungibleTokensOperations.call(this, items)];
      case 'fungibleTokens':
        return [await executeFungibleTokensOperations.call(this, items)];
      case 'stacking':
        return [await executeStackingOperations.call(this, items)];
      case 'names':
        return [await executeNamesOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let credentials: any = {};
      
      try {
        credentials = await this.getCredentials('stacksApi') as any;
      } catch (error: any) {
        credentials = {
          baseUrl: 'https://api.mainnet.hiro.so',
          apiKey: '',
        };
      }

      const baseUrl = credentials.baseUrl || 'https://api.mainnet.hiro.so';

      switch (operation) {
        case 'getAccount': {
          const principal = this.getNodeParameter('principal', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${encodeURIComponent(principal)}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountBalances': {
          const principal = this.getNodeParameter('principal', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${encodeURIComponent(principal)}/balances`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountStx': {
          const principal = this.getNodeParameter('principal', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${encodeURIComponent(principal)}/stx`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const principal = this.getNodeParameter('principal', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${encodeURIComponent(principal)}/transactions?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountNonces': {
          const principal = this.getNodeParameter('principal', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${encodeURIComponent(principal)}/nonces`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${address}/balances`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountInfo': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v2/accounts/${address}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
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
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${address}/stx_inbound?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }
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
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${address}/assets?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
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
        case 'getTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const type = this.getNodeParameter('type', i) as string;

          let url = `${baseUrl}/extended/v1/tx?limit=${limit}&offset=${offset}`;
          if (type) {
            url += `&type=${type}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
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
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'broadcastTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v2/transactions`,
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: transaction,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMempoolTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/tx/mempool?limit=${limit}&offset=${offset}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMempoolTransaction': {
          const txId = this.getNodeParameter('txId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/tx/mempool/${txId}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressMempoolTransactions': {
          const principal = this.getNodeParameter('principal', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/extended/v1/address/${principal}/mempool`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

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
        throw error;
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