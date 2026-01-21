/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    options: [
      {
        name: 'Get Balance',
        value: 'getBalance',
        description: 'Get account balance including STX and tokens',
        action: 'Get account balance',
      },
      {
        name: 'Get STX Balance',
        value: 'getStxBalance',
        description: 'Get STX balance only',
        action: 'Get STX balance',
      },
      {
        name: 'Get Transactions',
        value: 'getTransactions',
        description: 'Get account transaction history',
        action: 'Get account transactions',
      },
      {
        name: 'Get Assets',
        value: 'getAssets',
        description: 'Get account asset holdings',
        action: 'Get account assets',
      },
      {
        name: 'Get Nonce',
        value: 'getNonce',
        description: 'Get account nonce for transactions',
        action: 'Get account nonce',
      },
      {
        name: 'Get Mempool Transactions',
        value: 'getMempoolTransactions',
        description: 'Get pending transactions for account',
        action: 'Get mempool transactions',
      },
    ],
    default: 'getBalance',
  },
];

export const accountFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    description: 'Stacks address to query',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getTransactions'],
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
        resource: ['account'],
        operation: ['getTransactions'],
      },
    },
    default: 0,
    description: 'Number of results to skip',
  },
];

export async function executeAccountOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;
  const address = this.getNodeParameter('address', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);

    let result: unknown;

    switch (operation) {
      case 'getBalance':
        result = await client.getAccountBalance(address);
        break;
      case 'getStxBalance':
        result = await client.getAccountStxBalance(address);
        break;
      case 'getTransactions':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        const offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getAccountTransactions(address, { limit, offset });
        break;
      case 'getAssets':
        result = await client.getAccountAssets(address);
        break;
      case 'getNonce':
        result = await client.getAccountNonces(address);
        break;
      case 'getMempoolTransactions':
        result = await client.getAccountMempoolTransactions(address);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
