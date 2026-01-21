/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const blockOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['block'],
      },
    },
    options: [
      {
        name: 'Get Block',
        value: 'getBlock',
        description: 'Get block by hash or height',
        action: 'Get block',
      },
      {
        name: 'Get Block by Height',
        value: 'getBlockByHeight',
        description: 'Get block by height number',
        action: 'Get block by height',
      },
      {
        name: 'List Blocks',
        value: 'listBlocks',
        description: 'List recent blocks',
        action: 'List blocks',
      },
      {
        name: 'Get Block Transactions',
        value: 'getBlockTransactions',
        description: 'Get transactions in a block',
        action: 'Get block transactions',
      },
      {
        name: 'Get Latest Block',
        value: 'getLatestBlock',
        description: 'Get the latest block',
        action: 'Get latest block',
      },
    ],
    default: 'getLatestBlock',
  },
];

export const blockFields: INodeProperties[] = [
  {
    displayName: 'Block Hash or Height',
    name: 'blockHashOrHeight',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['block'],
        operation: ['getBlock', 'getBlockTransactions'],
      },
    },
    default: '',
    description: 'Block hash (0x...) or height number',
  },
  {
    displayName: 'Block Height',
    name: 'blockHeight',
    type: 'number',
    required: true,
    displayOptions: {
      show: {
        resource: ['block'],
        operation: ['getBlockByHeight'],
      },
    },
    default: 0,
    description: 'Block height number',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['block'],
        operation: ['listBlocks'],
      },
    },
    default: 20,
    description: 'Maximum number of blocks to return',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['block'],
        operation: ['listBlocks'],
      },
    },
    default: 0,
    description: 'Number of blocks to skip',
  },
];

export async function executeBlockOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getBlock':
        const blockHashOrHeight = this.getNodeParameter('blockHashOrHeight', itemIndex) as string;
        result = await client.getBlock(blockHashOrHeight);
        break;
      case 'getBlockByHeight':
        const height = this.getNodeParameter('blockHeight', itemIndex) as number;
        result = await client.getBlockByHeight(height);
        break;
      case 'listBlocks':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        const offset = this.getNodeParameter('offset', itemIndex, 0) as number;
        result = await client.getBlocks({ limit, offset });
        break;
      case 'getBlockTransactions':
        const txBlockHashOrHeight = this.getNodeParameter('blockHashOrHeight', itemIndex) as string;
        result = await client.getBlockTransactions(txBlockHashOrHeight);
        break;
      case 'getLatestBlock':
        result = await client.getLatestBlock();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
