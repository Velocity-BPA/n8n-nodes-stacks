/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const searchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['search'],
      },
    },
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Search for blocks, transactions, contracts, or addresses',
        action: 'Search blockchain',
      },
    ],
    default: 'search',
  },
];

export const searchFields: INodeProperties[] = [
  {
    displayName: 'Search Term',
    name: 'searchTerm',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search'],
      },
    },
    default: '',
    placeholder: 'Enter hash, address, contract ID, or block height',
    description: 'Block hash, transaction ID, contract ID, or address to search',
  },
  {
    displayName: 'Include Metadata',
    name: 'includeMetadata',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['search'],
        operation: ['search'],
      },
    },
    default: true,
    description: 'Whether to include additional metadata in results',
  },
];

export async function executeSearchOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'search':
        const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
        result = await client.search(searchTerm);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
