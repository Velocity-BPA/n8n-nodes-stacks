/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const microblockOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['microblock'],
      },
    },
    options: [
      {
        name: 'Get Microblock',
        value: 'getMicroblock',
        description: 'Get microblock by hash',
        action: 'Get microblock',
      },
      {
        name: 'List Microblocks',
        value: 'listMicroblocks',
        description: 'List recent microblocks',
        action: 'List microblocks',
      },
      {
        name: 'Get Unanchored Transactions',
        value: 'getUnanchored',
        description: 'Get unanchored microblock transactions',
        action: 'Get unanchored transactions',
      },
    ],
    default: 'listMicroblocks',
  },
];

export const microblockFields: INodeProperties[] = [
  {
    displayName: 'Microblock Hash',
    name: 'hash',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['microblock'],
        operation: ['getMicroblock'],
      },
    },
    default: '',
    description: 'Microblock hash',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['microblock'],
        operation: ['listMicroblocks'],
      },
    },
    default: 20,
    description: 'Maximum number of microblocks',
  },
];

export async function executeMicroblockOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getMicroblock':
        const hash = this.getNodeParameter('hash', itemIndex) as string;
        result = await client.getMicroblock(hash);
        break;
      case 'listMicroblocks':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getMicroblocks({ limit });
        break;
      case 'getUnanchored':
        result = await client.getUnanchoredMicroblocks();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
