/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const fungibleTokenOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['fungibleToken'],
      },
    },
    options: [
      {
        name: 'Get Holdings',
        value: 'getHoldings',
        description: 'Get fungible token holdings for an address',
        action: 'Get token holdings',
      },
      {
        name: 'Get Token Metadata',
        value: 'getMetadata',
        description: 'Get token metadata',
        action: 'Get token metadata',
      },
      {
        name: 'Get Token Holders',
        value: 'getHolders',
        description: 'Get token holders',
        action: 'Get token holders',
      },
    ],
    default: 'getHoldings',
  },
];

export const fungibleTokenFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['fungibleToken'],
        operation: ['getHoldings'],
      },
    },
    default: '',
    description: 'Address to query token holdings',
  },
  {
    displayName: 'Contract ID',
    name: 'contractId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['fungibleToken'],
        operation: ['getMetadata', 'getHolders'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.token-contract',
    description: 'Token contract identifier',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['fungibleToken'],
        operation: ['getHolders'],
      },
    },
    default: 20,
    description: 'Maximum number of holders to return',
  },
];

export async function executeFungibleTokenOperation(
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
        result = await client.getFtHoldings(address);
        break;
      case 'getMetadata':
        const metadataContractId = this.getNodeParameter('contractId', itemIndex) as string;
        result = await client.getFtMetadata(metadataContractId);
        break;
      case 'getHolders':
        const holdersContractId = this.getNodeParameter('contractId', itemIndex) as string;
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getFtHolders(holdersContractId, { limit });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
