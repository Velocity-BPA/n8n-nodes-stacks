/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const mempoolOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['mempool'],
      },
    },
    options: [
      {
        name: 'Get Mempool Stats',
        value: 'getStats',
        description: 'Get mempool statistics',
        action: 'Get mempool stats',
      },
      {
        name: 'Get Pending Transactions',
        value: 'getPending',
        description: 'List pending mempool transactions',
        action: 'Get pending transactions',
      },
      {
        name: 'Get Dropped Transactions',
        value: 'getDropped',
        description: 'Get dropped mempool transactions',
        action: 'Get dropped transactions',
      },
    ],
    default: 'getStats',
  },
];

export const mempoolFields: INodeProperties[] = [
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['mempool'],
        operation: ['getPending'],
      },
    },
    default: 20,
    description: 'Maximum number of transactions',
  },
];

export async function executeMempoolOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getStats':
        result = await client.getMempoolStats();
        break;
      case 'getPending':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getMempoolTransactions({ limit });
        break;
      case 'getDropped':
        result = await client.getDroppedMempool();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
