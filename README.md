# n8n-nodes-stacks

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with the Stacks blockchain network. This node provides 8 resources covering accounts, transactions, blocks, smart contracts, NFTs, fungible tokens, stacking operations, and name services, enabling comprehensive interaction with the Stacks ecosystem for DeFi and Web3 automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Blockchain](https://img.shields.io/badge/blockchain-Stacks-orange)
![DeFi](https://img.shields.io/badge/DeFi-Enabled-green)
![Web3](https://img.shields.io/badge/Web3-Compatible-purple)

## Features

- **Account Management** - Query account balances, transaction history, and STX holdings
- **Transaction Operations** - Create, broadcast, and monitor Stacks transactions
- **Block Data Access** - Retrieve block information and blockchain state data
- **Smart Contract Integration** - Deploy, call, and interact with Clarity smart contracts
- **NFT Management** - Handle non-fungible token transfers, metadata, and collections
- **Fungible Token Support** - Manage SIP-010 compliant token operations and transfers
- **Stacking Operations** - Participate in Stacks consensus and earn Bitcoin rewards
- **Name Service Integration** - Register and manage .btc domains and subdomains

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
| API Key | Stacks API key for authenticated requests | Yes |
| Environment | Network environment (mainnet/testnet) | Yes |
| Base URL | Custom Stacks API endpoint (optional) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve account balance and nonce information |
| Get STX Balance | Get STX token balance for an account |
| Get Transaction History | List all transactions for an account |
| Get Assets | Get fungible and non-fungible token holdings |
| Get Stacking Status | Check if account is participating in stacking |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by ID |
| Broadcast Transaction | Submit a signed transaction to the network |
| Get Transaction Status | Check transaction confirmation status |
| List Transactions | Get recent transactions with filtering |
| Estimate Fee | Calculate transaction fees |

### 3. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block data by hash or height |
| Get Latest Block | Get the most recent block |
| List Blocks | Get blocks with pagination |
| Get Block Transactions | List all transactions in a block |

### 4. Smart Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new Clarity smart contract |
| Call Function | Execute a contract function |
| Get Contract Info | Retrieve contract source and interface |
| Get Contract Events | List events emitted by a contract |
| Read Only Call | Execute read-only contract functions |

### 5. NonFungibleTokens

| Operation | Description |
|-----------|-------------|
| Get NFT Holdings | List NFTs owned by an account |
| Get NFT History | Get transfer history for an NFT |
| Get NFT Metadata | Retrieve NFT metadata and properties |
| Transfer NFT | Execute NFT transfer transaction |
| Get Collection Info | Get information about NFT collections |

### 6. FungibleTokens

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Check fungible token balance for account |
| Transfer Tokens | Execute token transfer transaction |
| Get Token Info | Retrieve token contract details |
| Get Token Holders | List accounts holding a specific token |
| Get Token Transfers | Get transfer history for a token |

### 7. Stacking

| Operation | Description |
|-----------|-------------|
| Get Stacking Info | Check network stacking statistics |
| Stack STX | Initiate STX stacking operation |
| Get Reward Slots | List Bitcoin reward addresses |
| Get Stacker Info | Get stacking details for an account |
| Get Pox Info | Retrieve Proof of Transfer cycle information |

### 8. Names

| Operation | Description |
|-----------|-------------|
| Get Name Info | Retrieve BNS name registration details |
| Resolve Name | Get address associated with a BNS name |
| Get Name History | List name transfer and update history |
| Get Namespace | Retrieve namespace information |
| List Names | Get names with filtering and pagination |

## Usage Examples

```javascript
// Get account STX balance
{
  "resource": "accounts",
  "operation": "getSTXBalance",
  "address": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

```javascript
// Deploy a smart contract
{
  "resource": "smartContracts",
  "operation": "deployContract",
  "contractName": "my-token",
  "sourceCode": "(define-fungible-token my-token)",
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

```javascript
// Transfer fungible tokens
{
  "resource": "fungibleTokens",
  "operation": "transferTokens",
  "contractId": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-token",
  "amount": "1000",
  "recipient": "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE"
}
```

```javascript
// Stack STX for Bitcoin rewards
{
  "resource": "stacking",
  "operation": "stackSTX",
  "amount": "100000000",
  "poxAddress": "1Xik14zRm29UsyS6DjhYg4iZeZqsDa8D3",
  "cycles": 6
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Insufficient Balance | Account lacks STX for transaction fees | Check account balance and add STX if needed |
| Contract Not Found | Smart contract does not exist at specified address | Verify contract address and deployment status |
| Transaction Failed | Transaction was rejected by the network | Check transaction parameters and network status |
| Rate Limit Exceeded | Too many API requests in short timeframe | Implement delays between requests |
| Network Error | Connection to Stacks network failed | Check network connectivity and API endpoint |

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
- **Stacks Documentation**: [docs.stacks.co](https://docs.stacks.co)
- **Stacks API Reference**: [docs.hiro.so](https://docs.hiro.so/api)