/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const infoOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['info'],
      },
    },
    options: [
      {
        name: 'Get Core API Info',
        value: 'getCoreApiInfo',
        description: 'Get core API info',
        action: 'Get core API info',
      },
      {
        name: 'Get Network Status',
        value: 'getNetworkStatus',
        description: 'Get current network status',
        action: 'Get network status',
      },
      {
        name: 'Get STX Supply',
        value: 'getStxSupply',
        description: 'Get total STX supply information',
        action: 'Get STX supply',
      },
      {
        name: 'Get Fee Rate',
        value: 'getFeeRate',
        description: 'Get current fee rate estimates',
        action: 'Get fee rate',
      },
      {
        name: 'Get PoX Info',
        value: 'getPoxInfo',
        description: 'Get Proof of Transfer information',
        action: 'Get PoX info',
      },
    ],
    default: 'getNetworkStatus',
  },
];

export const infoFields: INodeProperties[] = [];

export async function executeInfoOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getCoreApiInfo':
        result = await client.getCoreInfo();
        break;
      case 'getNetworkStatus':
        result = await client.getNetworkBlockTimes();
        break;
      case 'getStxSupply':
        result = await client.getTotalSupply();
        break;
      case 'getFeeRate':
        // Get core info which includes fee-related information
        result = await client.getCoreInfo();
        break;
      case 'getPoxInfo':
        result = await client.getPoxInfo();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
