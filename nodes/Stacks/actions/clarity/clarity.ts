/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { formatResponse, encodeClarityValue, decodeClarityValue } from '../../utils';
import { CLARITY_TYPES } from '../../constants';

export const clarityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['clarity'],
      },
    },
    options: [
      {
        name: 'Encode Value',
        value: 'encode',
        description: 'Encode a value to Clarity hex format',
        action: 'Encode Clarity value',
      },
      {
        name: 'Decode Value',
        value: 'decode',
        description: 'Decode a Clarity hex value',
        action: 'Decode Clarity value',
      },
    ],
    default: 'encode',
  },
];

export const clarityFields: INodeProperties[] = [
  {
    displayName: 'Clarity Type',
    name: 'clarityType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['clarity'],
        operation: ['encode'],
      },
    },
    options: CLARITY_TYPES,
    default: 'uint',
    description: 'Type of Clarity value to encode',
  },
  {
    displayName: 'Value',
    name: 'value',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['clarity'],
        operation: ['encode'],
      },
    },
    default: '',
    description: 'Value to encode (format depends on type)',
  },
  {
    displayName: 'Hex Value',
    name: 'hexValue',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['clarity'],
        operation: ['decode'],
      },
    },
    default: '',
    placeholder: '0x...',
    description: 'Clarity hex value to decode',
  },
];

export async function executeClarityOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  let result: unknown;

  switch (operation) {
    case 'encode':
      const clarityType = this.getNodeParameter('clarityType', itemIndex) as string;
      const value = this.getNodeParameter('value', itemIndex) as string;
      const encoded = encodeClarityValue(clarityType, value);
      result = { type: clarityType, originalValue: value, encodedHex: '0x' + encoded };
      break;
    case 'decode':
      const hexValue = this.getNodeParameter('hexValue', itemIndex) as string;
      const decoded = decodeClarityValue(hexValue);
      result = { originalHex: hexValue, decodedValue: decoded };
      break;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return formatResponse(result, itemIndex);
}
