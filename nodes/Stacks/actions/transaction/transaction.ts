/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const transactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
      },
    },
    options: [
      {
        name: 'Get Transaction',
        value: 'getTransaction',
        description: 'Get transaction by ID',
        action: 'Get transaction',
      },
      {
        name: 'Get Raw Transaction',
        value: 'getRawTransaction',
        description: 'Get raw transaction hex',
        action: 'Get raw transaction',
      },
      {
        name: 'List Transactions',
        value: 'listTransactions',
        description: 'List recent transactions',
        action: 'List transactions',
      },
      {
        name: 'Broadcast Transaction',
        value: 'broadcastTransaction',
        description: 'Broadcast a signed transaction',
        action: 'Broadcast transaction',
      },
      {
        name: 'Get Mempool Transactions',
        value: 'getMempoolTransactions',
        description: 'List pending mempool transactions',
        action: 'Get mempool transactions',
      },
    ],
    default: 'getTransaction',
  },
];

export const transactionFields: INodeProperties[] = [
  {
    displayName: 'Transaction ID',
    name: 'txId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['getTransaction', 'getRawTransaction'],
      },
    },
    default: '',
    placeholder: '0x...',
    description: 'Transaction ID (hash)',
  },
  {
    displayName: 'Signed Transaction Hex',
    name: 'txHex',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['broadcastTransaction'],
      },
    },
    default: '',
    description: 'Signed transaction in hex format',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['listTransactions', 'getMempoolTransactions'],
      },
    },
    default: 20,
    description: 'Maximum number of results',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['listTransactions', 'getMempoolTransactions'],
      },
    },
    default: 0,
    description: 'Number of results to skip',
  },
];

export async function executeTransactionOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getTransaction':
        const txId = this.getNodeParameter('txId', itemIndex) as string;
        result = await client.getTransaction(txId);
        break;
      case 'getRawTransaction':
        const rawTxId = this.getNodeParameter('txId', itemIndex) as string;
        result = await client.getTransactionRaw(rawTxId);
        break;
      case 'listTransactions':
        const listLimit = this.getNodeParameter('limit', itemIndex, 20) as number;
        const listOffset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getTransactions({ limit: listLimit, offset: listOffset });
        break;
      case 'broadcastTransaction':
        const txHex = this.getNodeParameter('txHex', itemIndex) as string;
        result = await client.broadcastTransaction(txHex);
        break;
      case 'getMempoolTransactions':
        const mempoolLimit = this.getNodeParameter('limit', itemIndex, 20) as number;
        const mempoolOffset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getMempoolTransactions({ limit: mempoolLimit, offset: mempoolOffset });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
