/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, INodeExecutionData } from 'n8n-workflow';
import { createHiroApiClientAsync } from '../../transport';
import { formatResponse, handleApiError } from '../../utils';

export const contractOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contract'],
      },
    },
    options: [
      {
        name: 'Get Contract Info',
        value: 'getContractInfo',
        description: 'Get contract information',
        action: 'Get contract info',
      },
      {
        name: 'Get Contract Source',
        value: 'getContractSource',
        description: 'Get contract source code',
        action: 'Get contract source',
      },
      {
        name: 'Get Contract Interface',
        value: 'getContractInterface',
        description: 'Get contract ABI/interface',
        action: 'Get contract interface',
      },
      {
        name: 'Get Contract Events',
        value: 'getContractEvents',
        description: 'Get contract events',
        action: 'Get contract events',
      },
      {
        name: 'Call Read-Only Function',
        value: 'callReadOnly',
        description: 'Call a read-only contract function',
        action: 'Call read-only function',
      },
      {
        name: 'Get Map Entry',
        value: 'getMapEntry',
        description: 'Get a map entry from contract',
        action: 'Get map entry',
      },
      {
        name: 'Get Deployed Contracts',
        value: 'getDeployedContracts',
        description: 'Get contracts deployed by an address',
        action: 'Get deployed contracts',
      },
    ],
    default: 'getContractInfo',
  },
];

export const contractFields: INodeProperties[] = [
  {
    displayName: 'Contract ID',
    name: 'contractId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getContractInfo', 'getContractSource', 'getContractInterface', 'getContractEvents', 'callReadOnly', 'getMapEntry'],
      },
    },
    default: '',
    placeholder: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name',
    description: 'Contract identifier (address.contract-name)',
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getDeployedContracts'],
      },
    },
    default: '',
    description: 'Address to query deployed contracts',
  },
  {
    displayName: 'Function Name',
    name: 'functionName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['callReadOnly'],
      },
    },
    default: '',
    description: 'Name of the read-only function to call',
  },
  {
    displayName: 'Sender Address',
    name: 'senderAddress',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['callReadOnly'],
      },
    },
    default: '',
    description: 'Address to use as sender (for simulated context)',
  },
  {
    displayName: 'Function Arguments (JSON)',
    name: 'functionArgs',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['callReadOnly'],
      },
    },
    default: '[]',
    description: 'Function arguments as JSON array of Clarity hex values',
  },
  {
    displayName: 'Map Name',
    name: 'mapName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getMapEntry'],
      },
    },
    default: '',
    description: 'Name of the map in the contract',
  },
  {
    displayName: 'Map Key (Clarity Hex)',
    name: 'mapKey',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getMapEntry'],
      },
    },
    default: '',
    description: 'Map key as Clarity hex value',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['getContractEvents'],
      },
    },
    default: 20,
    description: 'Maximum number of events to return',
  },
];

export async function executeContractOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', itemIndex) as string;

  try {
    const client = await createHiroApiClientAsync(this);
    let result: unknown;

    switch (operation) {
      case 'getContractInfo':
        const infoContractId = this.getNodeParameter('contractId', itemIndex) as string;
        result = await client.getContractInfo(infoContractId);
        break;
      case 'getContractSource':
        const sourceContractId = this.getNodeParameter('contractId', itemIndex) as string;
        result = await client.getContractSource(sourceContractId);
        break;
      case 'getContractInterface':
        const interfaceContractId = this.getNodeParameter('contractId', itemIndex) as string;
        result = await client.getContractInterface(interfaceContractId);
        break;
      case 'getContractEvents':
        const eventsContractId = this.getNodeParameter('contractId', itemIndex) as string;
        const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
        result = await client.getContractEvents(eventsContractId, { limit });
        break;
      case 'callReadOnly':
        const callContractId = this.getNodeParameter('contractId', itemIndex) as string;
        const functionName = this.getNodeParameter('functionName', itemIndex) as string;
        const senderAddress = this.getNodeParameter('senderAddress', itemIndex) as string;
        const argsJson = this.getNodeParameter('functionArgs', itemIndex, '[]') as string;
        const args = JSON.parse(argsJson) as string[];
        result = await client.callReadOnlyFunction(callContractId, functionName, senderAddress, args);
        break;
      case 'getMapEntry':
        const mapContractId = this.getNodeParameter('contractId', itemIndex) as string;
        const mapName = this.getNodeParameter('mapName', itemIndex) as string;
        const mapKey = this.getNodeParameter('mapKey', itemIndex) as string;
        result = await client.getMapEntry(mapContractId, mapName, mapKey);
        break;
      case 'getDeployedContracts':
        const address = this.getNodeParameter('address', itemIndex) as string;
        result = await client.getContractsDeployed(address);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return formatResponse(result, itemIndex);
  } catch (error) {
    return handleApiError(error);
  }
}
