/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class StacksNetwork implements ICredentialType {
  name = 'stacksNetwork';
  displayName = 'Stacks Network';
  documentationUrl = 'https://docs.stacks.co/';
  properties: INodeProperties[] = [
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      default: 'mainnet',
      options: [
        {
          name: 'Mainnet',
          value: 'mainnet',
          description: 'Stacks Mainnet (production)',
        },
        {
          name: 'Testnet',
          value: 'testnet',
          description: 'Stacks Testnet (testing)',
        },
        {
          name: 'Devnet',
          value: 'devnet',
          description: 'Local development network',
        },
      ],
    },
    {
      displayName: 'Node URL',
      name: 'nodeUrl',
      type: 'string',
      default: '',
      placeholder: 'https://stacks-node-api.mainnet.stacks.co',
      description: 'Custom Stacks node URL (leave empty for default)',
    },
    {
      displayName: 'Sender Private Key',
      name: 'senderPrivateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Private key for signing transactions (hex format without 0x prefix)',
    },
    {
      displayName: 'Fee Multiplier',
      name: 'feeMultiplier',
      type: 'number',
      default: 1,
      description: 'Multiplier for estimated transaction fees',
    },
  ];
}
