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
			typeOptions: { password: true },
			default: '',
			description: 'API key for authenticated requests (optional but recommended for higher rate limits)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.hiro.so',
			description: 'Base URL for the Stacks API',
		},
	];
}