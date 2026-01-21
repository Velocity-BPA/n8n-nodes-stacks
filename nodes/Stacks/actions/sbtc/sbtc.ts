/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const sbtcOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['sbtc'],
      },
    },
    options: [
      {
        name: 'Get sBTC Balance',
        value: 'getBalance',
        description: 'Get sBTC balance for an address',
        action: 'Get sBTC balance',
      },
    ],
    default: 'getBalance',
  },
];

export const sbtcFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['sbtc'],
      },
    },
    default: '',
    description: 'Stacks address to check sBTC balance',
  },
];

export async function executeSbtcOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getBalance':
        const address = this.getNodeParameter('address', itemIndex) as string;
        result = await client.getSbtcBalance(address);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
