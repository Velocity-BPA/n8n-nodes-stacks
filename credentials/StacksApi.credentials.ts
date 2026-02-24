import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class StacksApi implements ICredentialType {
	name = 'stacksApi';
	displayName = 'Stacks API';
	documentationUrl = 'https://docs.hiro.so/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.mainnet.hiro.so',
			description: 'Base URL for the Stacks API',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional API key for higher rate limits and priority access',
			required: false,
		},
	];
}