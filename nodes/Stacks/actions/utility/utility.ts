/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { formatResponse, handleApiError } from '../../utils';
import {
  isValidStacksAddress,
  isValidContractId,
  microStxToStx,
  stxToMicroStx,
} from '../../utils/clarityHelpers';

export const utilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['utility'],
      },
    },
    options: [
      {
        name: 'Validate Address',
        value: 'validateAddress',
        description: 'Validate a Stacks address',
        action: 'Validate address',
      },
      {
        name: 'Validate Contract ID',
        value: 'validateContractId',
        description: 'Validate a contract identifier',
        action: 'Validate contract ID',
      },
      {
        name: 'Convert STX to MicroSTX',
        value: 'stxToMicro',
        description: 'Convert STX to microSTX',
        action: 'Convert STX to microSTX',
      },
      {
        name: 'Convert MicroSTX to STX',
        value: 'microToStx',
        description: 'Convert microSTX to STX',
        action: 'Convert microSTX to STX',
      },
    ],
    default: 'validateAddress',
  },
];

export const utilityFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['utility'],
        operation: ['validateAddress'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    description: 'Stacks address to validate',
  },
  {
    displayName: 'Contract ID',
    name: 'contractId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['utility'],
        operation: ['validateContractId'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name',
    description: 'Contract identifier to validate',
  },
  {
    displayName: 'STX Amount',
    name: 'stxAmount',
    type: 'number',
    required: true,
    displayOptions: {
      show: {
        resource: ['utility'],
        operation: ['stxToMicro'],
      },
    },
    default: 0,
    description: 'Amount in STX to convert',
  },
  {
    displayName: 'MicroSTX Amount',
    name: 'microStxAmount',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['utility'],
        operation: ['microToStx'],
      },
    },
    default: '',
    description: 'Amount in microSTX to convert (use string for large numbers)',
  },
];

export async function executeUtilityOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    let result: unknown;

    switch (operation) {
      case 'validateAddress':
        const address = this.getNodeParameter('address', itemIndex) as string;
        const isValidAddr = isValidStacksAddress(address);
        result = {
          address,
          valid: isValidAddr,
          message: isValidAddr ? 'Valid Stacks address' : 'Invalid Stacks address format',
        };
        break;

      case 'validateContractId':
        const contractId = this.getNodeParameter('contractId', itemIndex) as string;
        const isValidContract = isValidContractId(contractId);
        result = {
          contractId,
          valid: isValidContract,
          message: isValidContract ? 'Valid contract ID' : 'Invalid contract ID format',
        };
        break;

      case 'stxToMicro':
        const stxAmount = this.getNodeParameter('stxAmount', itemIndex) as number;
        const microAmount = stxToMicroStx(stxAmount);
        result = {
          stx: stxAmount,
          microStx: microAmount.toString(),
          formatted: `${stxAmount} STX = ${microAmount.toString()} µSTX`,
        };
        break;

      case 'microToStx':
        const microStxAmount = this.getNodeParameter('microStxAmount', itemIndex) as string;
        const stx = microStxToStx(microStxAmount);
        result = {
          microStx: microStxAmount,
          stx: stx,
          formatted: `${microStxAmount} µSTX = ${stx} STX`,
        };
        break;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
