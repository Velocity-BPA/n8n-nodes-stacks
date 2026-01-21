/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const stackingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['stacking'],
      },
    },
    options: [
      {
        name: 'Get PoX Info',
        value: 'getPoxInfo',
        description: 'Get Proof of Transfer information',
        action: 'Get PoX info',
      },
      {
        name: 'Get PoX Cycle',
        value: 'getPoxCycle',
        description: 'Get specific PoX cycle information',
        action: 'Get PoX cycle',
      },
      {
        name: 'List PoX Cycles',
        value: 'listPoxCycles',
        description: 'List PoX cycles',
        action: 'List PoX cycles',
      },
      {
        name: 'Get Stacker Info',
        value: 'getStackerInfo',
        description: 'Get stacking information for an address',
        action: 'Get stacker info',
      },
    ],
    default: 'getPoxInfo',
  },
];

export const stackingFields: INodeProperties[] = [
  {
    displayName: 'Cycle Number',
    name: 'cycleNumber',
    type: 'number',
    required: true,
    displayOptions: {
      show: {
        resource: ['stacking'],
        operation: ['getPoxCycle'],
      },
    },
    default: 0,
    description: 'PoX cycle number',
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['stacking'],
        operation: ['getStackerInfo'],
      },
    },
    default: '',
    description: 'Stacker address',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['stacking'],
        operation: ['listPoxCycles'],
      },
    },
    default: 20,
    description: 'Maximum number of cycles to return',
  },
];

export async function executeStackingOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getPoxInfo':
        result = await client.getPoxInfo();
        break;
      case 'getPoxCycle':
        const cycleNumber = this.getNodeParameter('cycleNumber', itemIndex) as number;
        result = await client.getPoxCycle(cycleNumber);
        break;
      case 'listPoxCycles':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getPoxCycles({ limit });
        break;
      case 'getStackerInfo':
        const address = this.getNodeParameter('address', itemIndex) as string;
        result = await client.getStackerInfo(address);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
