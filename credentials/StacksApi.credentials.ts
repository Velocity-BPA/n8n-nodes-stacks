import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class StacksApi implements ICredentialType {
	name = 'stacksApi';
	displayName = 'Stacks API';
	documentationUrl = 'https://docs.hiro.so/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for Stacks API authentication (optional for basic operations)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://stacks-node-api.mainnet.stacks.co',
			description: 'The base URL for the Stacks API',
		},
	];
}