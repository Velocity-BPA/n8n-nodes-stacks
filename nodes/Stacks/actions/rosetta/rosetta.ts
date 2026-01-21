/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const rosettaOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['rosetta'],
      },
    },
    options: [
      {
        name: 'Get Network List',
        value: 'getNetworkList',
        description: 'Get list of available networks',
        action: 'Get network list',
      },
      {
        name: 'Get Network Status',
        value: 'getNetworkStatus',
        description: 'Get network status via Rosetta',
        action: 'Get network status',
      },
      {
        name: 'Get Network Options',
        value: 'getNetworkOptions',
        description: 'Get network options',
        action: 'Get network options',
      },
      {
        name: 'Get Block',
        value: 'getBlock',
        description: 'Get block by identifier via Rosetta',
        action: 'Get block',
      },
      {
        name: 'Get Account Balance',
        value: 'getAccountBalance',
        description: 'Get account balance via Rosetta',
        action: 'Get account balance',
      },
    ],
    default: 'getNetworkList',
  },
];

export const rosettaFields: INodeProperties[] = [
  {
    displayName: 'Block Identifier',
    name: 'blockIdentifier',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['rosetta'],
        operation: ['getBlock'],
      },
    },
    default: '',
    description: 'Block hash or height',
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['rosetta'],
        operation: ['getAccountBalance'],
      },
    },
    default: '',
    description: 'Stacks address for balance lookup',
  },
];

export async function executeRosettaOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    const networkIdentifier = { blockchain: 'stacks', network: 'mainnet' };

    switch (operation) {
      case 'getNetworkList':
        result = await client.rosettaNetworkList();
        break;
      case 'getNetworkStatus':
        result = await client.rosettaNetworkStatus(networkIdentifier);
        break;
      case 'getNetworkOptions':
        // Network options can be retrieved from network status
        result = await client.rosettaNetworkStatus(networkIdentifier);
        break;
      case 'getBlock':
        const blockIdentifier = this.getNodeParameter('blockIdentifier', itemIndex, '') as string;
        const blockId = /^\d+$/.test(blockIdentifier) 
          ? { index: parseInt(blockIdentifier, 10) } 
          : { hash: blockIdentifier };
        result = await client.rosettaBlock(networkIdentifier, blockId);
        break;
      case 'getAccountBalance':
        const address = this.getNodeParameter('address', itemIndex) as string;
        result = await client.rosettaAccountBalance(networkIdentifier, { address });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
