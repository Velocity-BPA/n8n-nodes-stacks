# n8n-nodes-stacks

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Stacks blockchain providing 19 resources and 100+ operations for STX transfers, smart contracts, NFTs, sBTC, BNS, stacking, and Bitcoin Ordinals integration.

![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![Stacks](https://img.shields.io/badge/Stacks-blockchain-purple)

## Features

- **Account Management**: Query balances, transactions, assets, and nonces
- **Transaction Handling**: Broadcast, track, and monitor transactions
- **Smart Contracts**: Deploy, interact with, and query Clarity smart contracts
- **NFT Operations**: Track holdings, transfers, and minting activity
- **sBTC Integration**: Monitor sBTC balances and operations
- **BNS (Bitcoin Naming System)**: Resolve names, manage namespaces
- **Stacking Rewards**: Monitor PoX cycles and stacking status
- **Bitcoin Ordinals**: Query inscriptions and BRC-20 tokens
- **Trigger Node**: Automated workflows for blockchain events

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-stacks`
5. Accept the risks and install

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Create custom nodes directory if it doesn't exist
mkdir -p custom

# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-stacks.git custom/n8n-nodes-stacks

# Install dependencies and build
cd custom/n8n-nodes-stacks
pnpm install
pnpm run build

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-stacks.git
cd n8n-nodes-stacks

# Install dependencies
pnpm install

# Build
pnpm run build

# Link to n8n custom directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-stacks

# Restart n8n
```

## Credentials Setup

### Hiro API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| API Endpoint | Network selection (Mainnet/Testnet/Custom) | Yes |
| Custom Endpoint | Custom API URL (if using Custom endpoint) | No |
| API Key | Hiro API key for higher rate limits | No |

### Stacks Network Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Network | Mainnet, Testnet, or Custom | Yes |
| Node URL | Stacks node URL | No |
| Private Key | Account private key for signing | No |
| Fee Multiplier | Transaction fee multiplier | No |

### Bitcoin Connection Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Provider | Blockstream, Mempool.space, or Custom | Yes |
| Custom URL | Custom Bitcoin API URL | No |

## Resources & Operations

### Account
- Get Balance
- Get STX Balance
- Get Transactions
- Get Assets
- Get Nonce
- Get Mempool Transactions

### Transaction
- Get Transaction
- Get Raw Transaction
- List Transactions
- Broadcast Transaction
- Get Mempool Transactions

### Block
- Get Block
- Get Block by Height
- List Blocks
- Get Block Transactions
- Get Latest Block

### Contract
- Get Contract Info
- Get Contract Source
- Get Contract Interface
- Get Contract Events
- Call Read-Only Function
- Get Map Entry
- Get Deployed Contracts

### NFT
- Get Holdings
- Get History
- Get Mints

### Stacking
- Get PoX Info
- Get PoX Cycle
- List PoX Cycles
- Get Stacker Info

### sBTC
- Get Balance

### BNS (Names)
- Get Names by Address
- Get Name Info
- Get Zone File
- Get Name Price
- List Namespaces
- Get Namespace Info

### Ordinals
- Get Inscription
- List Inscriptions
- Get Inscription Transfers
- Get Satoshi Info
- List BRC-20 Tokens
- Get BRC-20 Token

### Token Transfer
- Get Balance
- Get Transfer History
- Estimate Fee

### Fungible Token
- Get Holdings
- Get Metadata
- Get Holders

### Burn Block
- Get Burn Block
- List Burn Blocks

### Microblock
- Get Microblock
- List Microblocks
- Get Unanchored Transactions

### Mempool
- Get Stats
- Get Pending
- Get Dropped

### Clarity
- Encode Value
- Decode Value

### Search
- Search (blocks, transactions, contracts, addresses)

### Info
- Get Core API Info
- Get Network Status
- Get STX Supply
- Get Fee Rate
- Get PoX Info

### Rosetta
- Get Network List
- Get Network Status
- Get Network Options
- Get Block
- Get Account Balance

### Utility
- Validate Address
- Parse Contract ID
- Format STX Amount

## Trigger Node

The Stacks Trigger node enables automated workflows based on blockchain events:

| Event | Description |
|-------|-------------|
| New Block | Triggers when a new block is confirmed |
| New Microblock | Triggers when a new microblock is created |
| Address Transaction | Triggers when an address receives a transaction |
| Contract Event | Triggers on smart contract events |
| STX Transfer | Triggers on STX transfers to/from an address |
| Mempool Activity | Triggers on new mempool transactions |
| Stacking Event | Triggers on stacking cycle changes |

## Usage Examples

### Get Account Balance

```javascript
// Using Stacks node with Account resource
{
  "resource": "account",
  "operation": "getBalance",
  "address": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

### Call Read-Only Contract Function

```javascript
// Using Stacks node with Contract resource
{
  "resource": "contract",
  "operation": "callReadOnly",
  "contractId": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract",
  "functionName": "get-value",
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "arguments": []
}
```

### Query NFT Holdings

```javascript
// Using Stacks node with NFT resource
{
  "resource": "nft",
  "operation": "getHoldings",
  "address": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

## Stacks Concepts

### Addresses
- **Mainnet**: Start with `SP` or `SM`
- **Testnet**: Start with `ST` or `SN`

### Contract IDs
Format: `<address>.<contract-name>`
Example: `SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract`

### Clarity Types
- `int`: Signed 128-bit integer
- `uint`: Unsigned 128-bit integer
- `bool`: Boolean (true/false)
- `principal`: Stacks address or contract identifier
- `buffer`: Byte buffer
- `string-ascii`: ASCII string
- `string-utf8`: UTF-8 string

### STX Units
- 1 STX = 1,000,000 microSTX
- All amounts in the API are in microSTX

## Networks

| Network | API URL | Description |
|---------|---------|-------------|
| Mainnet | https://api.mainnet.hiro.so | Production network |
| Testnet | https://api.testnet.hiro.so | Test network |
| Devnet | http://localhost:3999 | Local development |

## Error Handling

The node provides detailed error messages for common issues:

- **400 Bad Request**: Invalid parameters or malformed request
- **401 Unauthorized**: Invalid or missing API key
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: API service error

## Security Best Practices

1. **API Keys**: Store API keys as n8n credentials, never in workflow data
2. **Private Keys**: Only use private keys in secure, production environments
3. **Rate Limits**: Use API keys for higher rate limits in production
4. **Testnet First**: Test workflows on testnet before deploying to mainnet

## Development

```bash
# Run linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Run tests
pnpm test

# Run tests with coverage
pnpm run test:coverage

# Build
pnpm run build
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-stacks/issues)
- **Documentation**: [Stacks API Docs](https://docs.hiro.so/stacks)
- **Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Hiro](https://hiro.so) for the Stacks API
- [Stacks Foundation](https://stacks.org) for the Stacks blockchain
- [n8n](https://n8n.io) for the workflow automation platform
