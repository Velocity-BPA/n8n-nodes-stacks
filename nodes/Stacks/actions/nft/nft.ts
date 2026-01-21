/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const nftOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['nft'],
      },
    },
    options: [
      {
        name: 'Get Holdings',
        value: 'getHoldings',
        description: 'Get NFT holdings for an address',
        action: 'Get NFT holdings',
      },
      {
        name: 'Get History',
        value: 'getHistory',
        description: 'Get NFT transfer history',
        action: 'Get NFT history',
      },
      {
        name: 'Get Mints',
        value: 'getMints',
        description: 'Get NFT mint events',
        action: 'Get NFT mints',
      },
    ],
    default: 'getHoldings',
  },
];

export const nftFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['nft'],
        operation: ['getHoldings'],
      },
    },
    default: '',
    description: 'Address to query NFT holdings',
  },
  {
    displayName: 'Asset Identifier',
    name: 'assetIdentifier',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['nft'],
        operation: ['getHistory', 'getMints'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.nft-contract::nft-name',
    description: 'Full NFT asset identifier',
  },
  {
    displayName: 'NFT Value (Token ID)',
    name: 'nftValue',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['nft'],
        operation: ['getHistory'],
      },
    },
    default: '',
    description: 'NFT token ID (Clarity hex encoded)',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['nft'],
        operation: ['getHoldings', 'getMints'],
      },
    },
    default: 50,
    description: 'Maximum number of results',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['nft'],
        operation: ['getHoldings', 'getMints'],
      },
    },
    default: 0,
    description: 'Number of results to skip',
  },
];

export async function executeNftOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getHoldings':
        const address = this.getNodeParameter('address', itemIndex) as string;
        const holdingsLimit = this.getNodeParameter('limit', itemIndex, 50) as number;
        const holdingsOffset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getNftHoldings(address, { limit: holdingsLimit, offset: holdingsOffset });
        break;
      case 'getHistory':
        const historyAssetId = this.getNodeParameter('assetIdentifier', itemIndex) as string;
        const nftValue = this.getNodeParameter('nftValue', itemIndex) as string;
        result = await client.getNftHistory(historyAssetId, nftValue);
        break;
      case 'getMints':
        const mintsAssetId = this.getNodeParameter('assetIdentifier', itemIndex) as string;
        const mintsLimit = this.getNodeParameter('limit', itemIndex, 50) as number;
        const mintsOffset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getNftMints(mintsAssetId, { limit: mintsLimit, offset: mintsOffset });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
