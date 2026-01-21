/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError, stxToMicroStx } from '../../utils';

export const tokenTransferOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tokenTransfer'],
      },
    },
    options: [
      {
        name: 'Get STX Balance',
        value: 'getBalance',
        description: 'Get STX balance for an address',
        action: 'Get STX balance',
      },
      {
        name: 'Get Transfer History',
        value: 'getTransferHistory',
        description: 'Get STX transfer history',
        action: 'Get transfer history',
      },
      {
        name: 'Estimate Transfer Fee',
        value: 'estimateFee',
        description: 'Estimate fee for STX transfer',
        action: 'Estimate transfer fee',
      },
    ],
    default: 'getBalance',
  },
];

export const tokenTransferFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['tokenTransfer'],
      },
    },
    default: '',
    description: 'Stacks address',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['tokenTransfer'],
        operation: ['getTransferHistory'],
      },
    },
    default: 20,
    description: 'Maximum number of transfers',
  },
];

export async function executeTokenTransferOperation(
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
        result = await client.getAccountStxBalance(address);
        break;
      case 'getTransferHistory':
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getAccountTransactions(address, { limit });
        break;
      case 'estimateFee':
        const info = await client.getCoreInfo() as { stacks_tip_height: number };
        result = { estimatedFee: '0.001', estimatedFeeInMicroStx: stxToMicroStx(0.001).toString(), currentBlockHeight: info.stacks_tip_height };
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
