/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const ordinalsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['ordinals'],
      },
    },
    options: [
      {
        name: 'Get Inscription',
        value: 'getInscription',
        description: 'Get Bitcoin Ordinals inscription by ID',
        action: 'Get inscription',
      },
      {
        name: 'List Inscriptions',
        value: 'listInscriptions',
        description: 'List inscriptions',
        action: 'List inscriptions',
      },
      {
        name: 'Get Inscription Transfers',
        value: 'getInscriptionTransfers',
        description: 'Get transfer history for an inscription',
        action: 'Get inscription transfers',
      },
      {
        name: 'Get Satoshi Info',
        value: 'getSatoshi',
        description: 'Get information about a specific satoshi',
        action: 'Get satoshi info',
      },
      {
        name: 'List BRC-20 Tokens',
        value: 'listBrc20',
        description: 'List BRC-20 tokens',
        action: 'List BRC-20 tokens',
      },
      {
        name: 'Get BRC-20 Token',
        value: 'getBrc20Token',
        description: 'Get BRC-20 token information',
        action: 'Get BRC-20 token',
      },
    ],
    default: 'listInscriptions',
  },
];

export const ordinalsFields: INodeProperties[] = [
  {
    displayName: 'Inscription ID',
    name: 'inscriptionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ordinals'],
        operation: ['getInscription', 'getInscriptionTransfers'],
      },
    },
    default: '',
    description: 'Ordinals inscription ID',
  },
  {
    displayName: 'Satoshi Ordinal',
    name: 'satoshiOrdinal',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ordinals'],
        operation: ['getSatoshi'],
      },
    },
    default: '',
    description: 'Satoshi ordinal number',
  },
  {
    displayName: 'BRC-20 Ticker',
    name: 'brc20Ticker',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['ordinals'],
        operation: ['getBrc20Token'],
      },
    },
    default: '',
    description: 'BRC-20 token ticker',
  },
  {
    displayName: 'Address Filter',
    name: 'addressFilter',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['ordinals'],
        operation: ['listInscriptions'],
      },
    },
    default: '',
    description: 'Filter inscriptions by address',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['ordinals'],
        operation: ['listInscriptions', 'listBrc20'],
      },
    },
    default: 20,
    description: 'Maximum number of results',
  },
];

export async function executeOrdinalsOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getInscription':
        const inscriptionId = this.getNodeParameter('inscriptionId', itemIndex) as string;
        result = await client.getOrdinalsInscription(inscriptionId);
        break;
      case 'listInscriptions':
        const listLimit = this.getNodeParameter('limit', itemIndex, 20) as number;
        const addressFilter = this.getNodeParameter('addressFilter', itemIndex, '') as string;
        const params: { limit: number; address?: string } = { limit: listLimit };
        if (addressFilter) params.address = addressFilter;
        result = await client.getOrdinalsInscriptions(params);
        break;
      case 'getInscriptionTransfers':
        const transferId = this.getNodeParameter('inscriptionId', itemIndex) as string;
        result = await client.getOrdinalsInscriptionTransfers(transferId);
        break;
      case 'getSatoshi':
        const satoshiOrdinal = this.getNodeParameter('satoshiOrdinal', itemIndex) as string;
        result = await client.getOrdinalsSatoshi(satoshiOrdinal);
        break;
      case 'listBrc20':
        const brc20Limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getOrdinalsBrc20Tokens({ limit: brc20Limit });
        break;
      case 'getBrc20Token':
        const ticker = this.getNodeParameter('brc20Ticker', itemIndex) as string;
        result = await client.getOrdinalsBrc20Token(ticker);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
