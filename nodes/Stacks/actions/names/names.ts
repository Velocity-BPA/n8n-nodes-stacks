/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const namesOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['names'],
      },
    },
    options: [
      {
        name: 'Get Names by Address',
        value: 'getNamesByAddress',
        description: 'Get BNS names owned by an address',
        action: 'Get names by address',
      },
      {
        name: 'Get Name Info',
        value: 'getNameInfo',
        description: 'Get information about a BNS name',
        action: 'Get name info',
      },
      {
        name: 'Get Zone File',
        value: 'getZoneFile',
        description: 'Get zone file for a name',
        action: 'Get zone file',
      },
      {
        name: 'Get Name Price',
        value: 'getNamePrice',
        description: 'Get price to register a name',
        action: 'Get name price',
      },
      {
        name: 'List Namespaces',
        value: 'listNamespaces',
        description: 'List all BNS namespaces',
        action: 'List namespaces',
      },
      {
        name: 'Get Namespace Info',
        value: 'getNamespaceInfo',
        description: 'Get namespace information',
        action: 'Get namespace info',
      },
    ],
    default: 'getNamesByAddress',
  },
];

export const namesFields: INodeProperties[] = [
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['names'],
        operation: ['getNamesByAddress'],
      },
    },
    default: '',
    description: 'Stacks address to query',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['names'],
        operation: ['getNameInfo', 'getZoneFile', 'getNamePrice'],
      },
    },
    default: '',
    placeholder: 'example.btc',
    description: 'BNS name to query',
  },
  {
    displayName: 'Namespace',
    name: 'namespace',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['names'],
        operation: ['getNamespaceInfo'],
      },
    },
    default: 'btc',
    description: 'BNS namespace',
  },
];

export async function executeNamesOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getNamesByAddress':
        const address = this.getNodeParameter('address', itemIndex) as string;
        result = await client.getBnsNames(address);
        break;
      case 'getNameInfo':
        const nameInfo = this.getNodeParameter('name', itemIndex) as string;
        result = await client.getBnsNameInfo(nameInfo);
        break;
      case 'getZoneFile':
        const nameZone = this.getNodeParameter('name', itemIndex) as string;
        result = await client.getBnsZoneFile(nameZone);
        break;
      case 'getNamePrice':
        const namePrice = this.getNodeParameter('name', itemIndex) as string;
        result = await client.getBnsPrice(namePrice);
        break;
      case 'listNamespaces':
        result = await client.getBnsNamespaces();
        break;
      case 'getNamespaceInfo':
        const namespace = this.getNodeParameter('namespace', itemIndex) as string;
        result = await client.getBnsNamespace(namespace);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
