/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class HiroApi implements ICredentialType {
  name = 'hiroApi';
  displayName = 'Hiro API';
  documentationUrl = 'https://docs.hiro.so/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Endpoint',
      name: 'apiEndpoint',
      type: 'options',
      default: 'mainnet',
      options: [
        {
          name: 'Mainnet',
          value: 'mainnet',
          description: 'Stacks Mainnet via Hiro API',
        },
        {
          name: 'Testnet',
          value: 'testnet',
          description: 'Stacks Testnet via Hiro API',
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Custom API endpoint',
        },
      ],
    },
    {
      displayName: 'Custom Endpoint URL',
      name: 'customEndpoint',
      type: 'string',
      default: '',
      placeholder: 'https://your-stacks-node.example.com',
      description: 'URL of your custom Stacks API endpoint',
      displayOptions: {
        show: {
          apiEndpoint: ['custom'],
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
      description: 'Hiro API key for higher rate limits (optional for public endpoints)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'x-hiro-api-key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.apiEndpoint === "mainnet" ? "https://api.mainnet.hiro.so" : $credentials.apiEndpoint === "testnet" ? "https://api.testnet.hiro.so" : $credentials.customEndpoint}}',
      url: '/v2/info',
      method: 'GET',
    },
  };
}
