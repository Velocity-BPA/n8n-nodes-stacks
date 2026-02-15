# n8n-nodes-stacks

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with the Stacks blockchain network. This node provides access to 7 core resources including blocks, transactions, accounts, smart contracts, tokens, network information, and microblocks, enabling comprehensive blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Layer2-yellow)
![Smart Contracts](https://img.shields.io/badge/Clarity-Smart%20Contracts-purple)

## Features

- **Comprehensive Blockchain Access** - Full access to blocks, transactions, accounts, and network information
- **Smart Contract Integration** - Deploy, call, and monitor Clarity smart contracts on the Stacks network
- **Token & Asset Management** - Query and manage fungible and non-fungible tokens across the network
- **Real-time Monitoring** - Track microblocks, transaction status, and network health in real-time
- **Account Analytics** - Retrieve detailed account information, balances, and transaction history
- **Network Intelligence** - Access network statistics, block times, and consensus information
- **Flexible Authentication** - Secure API key-based authentication for enterprise usage
- **Production Ready** - Built with TypeScript for reliability and comprehensive error handling

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-stacks`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-stacks
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-stacks.git
cd n8n-nodes-stacks
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-stacks
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Stacks API key for authentication | Yes |
| Base URL | Custom API endpoint (leave empty for default mainnet) | No |
| Network | Target network (mainnet, testnet) | Yes |

## Resources & Operations

### 1. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve a specific block by hash or height |
| List Blocks | Get a list of recent blocks with pagination |
| Get Block Transactions | Fetch all transactions within a specific block |
| Get Block by Height | Retrieve block information by block height |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by transaction ID |
| List Transactions | Get recent transactions with filtering options |
| Get Transaction Status | Check the current status of a transaction |
| Broadcast Transaction | Submit a signed transaction to the network |
| Get Mempool Transactions | Retrieve pending transactions from mempool |

### 3. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve account balance and nonce information |
| Get Account Transactions | List all transactions for a specific account |
| Get Account Assets | Fetch fungible and non-fungible token holdings |
| Get Account STX Balance | Get STX token balance for an account |

### 4. SmartContracts

| Operation | Description |
|-----------|-------------|
| Get Contract Info | Retrieve smart contract details and source code |
| Call Contract Function | Execute a read-only contract function call |
| Get Contract Interface | Fetch contract ABI and function signatures |
| List Contract Events | Get events emitted by a specific contract |
| Get Contract Source | Retrieve the Clarity source code of a contract |

### 5. TokensAndAssets

| Operation | Description |
|-----------|-------------|
| Get Fungible Tokens | List all fungible tokens on the network |
| Get NFT Collections | Retrieve non-fungible token collections |
| Get Token Metadata | Fetch metadata for specific tokens |
| Get Token Holders | List holders of a specific token |
| Get Asset Info | Get detailed information about any asset |

### 6. NetworkInfo

| Operation | Description |
|-----------|-------------|
| Get Network Status | Retrieve current network health and statistics |
| Get Block Time | Get average block time and network metrics |
| Get Consensus Info | Fetch consensus mechanism details |
| Get Peer Info | Retrieve network peer information |

### 7. Microblocks

| Operation | Description |
|-----------|-------------|
| Get Microblock | Retrieve a specific microblock by hash |
| List Microblocks | Get recent microblocks with pagination |
| Get Microblock Transactions | Fetch transactions within a microblock |

## Usage Examples

### Get Latest Block Information
```javascript
// Retrieve the most recent block
const workflow = {
  nodes: [{
    type: 'n8n-nodes-stacks.stacks',
    parameters: {
      resource: 'Blocks',
      operation: 'Get Block',
      blockIdentifier: 'latest'
    }
  }]
};
```

### Check Account Balance
```javascript
// Get STX balance for a specific address
const workflow = {
  nodes: [{
    type: 'n8n-nodes-stacks.stacks',
    parameters: {
      resource: 'Accounts',
      operation: 'Get Account Info',
      principal: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE'
    }
  }]
};
```

### Call Smart Contract Function
```javascript
// Execute a read-only contract function
const workflow = {
  nodes: [{
    type: 'n8n-nodes-stacks.stacks',
    parameters: {
      resource: 'SmartContracts',
      operation: 'Call Contract Function',
      contractAddress: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
      contractName: 'my-contract',
      functionName: 'get-balance',
      arguments: ['SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE']
    }
  }]
};
```

### Monitor Transaction Status
```javascript
// Track a transaction until confirmation
const workflow = {
  nodes: [{
    type: 'n8n-nodes-stacks.stacks',
    parameters: {
      resource: 'Transactions',
      operation: 'Get Transaction Status',
      txId: '0x1234567890abcdef1234567890abcdef12345678'
    }
  }]
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key is correct and active |
| Network Timeout | Request timed out while connecting to Stacks API | Check network connectivity and API endpoint status |
| Invalid Address Format | Provided Stacks address format is incorrect | Ensure address follows proper Stacks format (SP...) |
| Contract Not Found | Smart contract does not exist at specified address | Verify contract address and deployment status |
| Rate Limit Exceeded | Too many API requests in a short time period | Implement request throttling or upgrade API plan |
| Transaction Not Found | Specified transaction ID does not exist | Confirm transaction ID is correct and broadcasted |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-stacks/issues)
- **Stacks API Documentation**: [docs.stacks.co](https://docs.stacks.co)
- **Stacks Community**: [stacks.org/community](https://stacks.org/community)