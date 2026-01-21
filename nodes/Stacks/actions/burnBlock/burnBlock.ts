/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const burnBlockOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['burnBlock'],
      },
    },
    options: [
      {
        name: 'Get Burn Block',
        value: 'getBurnBlock',
        description: 'Get Bitcoin burn block by height or hash',
        action: 'Get burn block',
      },
      {
        name: 'List Burn Blocks',
        value: 'listBurnBlocks',
        description: 'List recent Bitcoin burn blocks',
        action: 'List burn blocks',
      },
    ],
    default: 'listBurnBlocks',
  },
];

export const burnBlockFields: INodeProperties[] = [
  {
    displayName: 'Height or Hash',
    name: 'heightOrHash',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['burnBlock'],
        operation: ['getBurnBlock'],
      },
    },
    default: '',
    description: 'Bitcoin block height or hash',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['burnBlock'],
        operation: ['listBurnBlocks'],
      },
    },
    default: 20,
    description: 'Maximum number of burn blocks',
  },
];

export async function executeBurnBlockOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getBurnBlock':
        const heightOrHash = this.getNodeParameter('heightOrHash', itemIndex) as string;
        result = await client.getBurnBlock(heightOrHash);
        break;
      case 'listBurnBlocks':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getBurnBlocks({ limit });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
