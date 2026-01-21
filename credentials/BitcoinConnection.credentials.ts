/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class BitcoinConnection implements ICredentialType {
  name = 'bitcoinConnection';
  displayName = 'Bitcoin Connection';
  documentationUrl = 'https://docs.stacks.co/';
  properties: INodeProperties[] = [
    {
      displayName: 'Bitcoin API Provider',
      name: 'provider',
      type: 'options',
      default: 'blockstream',
      options: [
        {
          name: 'Blockstream',
          value: 'blockstream',
          description: 'Blockstream.info API',
        },
        {
          name: 'Mempool.space',
          value: 'mempool',
          description: 'Mempool.space API',
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Custom Bitcoin API endpoint',
        },
      ],
    },
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      default: 'mainnet',
      options: [
        {
          name: 'Mainnet',
          value: 'mainnet',
          description: 'Bitcoin Mainnet',
        },
        {
          name: 'Testnet',
          value: 'testnet',
          description: 'Bitcoin Testnet',
        },
      ],
    },
    {
      displayName: 'Custom API URL',
      name: 'customUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-bitcoin-api.example.com',
      description: 'URL of your custom Bitcoin API endpoint',
      displayOptions: {
        show: {
          provider: ['custom'],
        },
      },
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API key for premium endpoints (if required)',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.provider === "blockstream" ? ($credentials.network === "mainnet" ? "https://blockstream.info/api" : "https://blockstream.info/testnet/api") : $credentials.provider === "mempool" ? ($credentials.network === "mainnet" ? "https://mempool.space/api" : "https://mempool.space/testnet/api") : $credentials.customUrl}}',
      url: '/blocks/tip/height',
      method: 'GET',
    },
  };
}
