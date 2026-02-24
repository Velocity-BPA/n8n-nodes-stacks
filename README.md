# n8n-nodes-stacks

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This community node enables n8n integration with the Stacks blockchain ecosystem, providing access to 7 core resources including smart contracts, NFTs, fungible tokens, stacking operations, transactions, blocks, and BNS names for building comprehensive blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange)
![Bitcoin](https://img.shields.io/badge/Bitcoin-Layer%202-yellow)
![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Clarity-purple)

## Features

- **Smart Contract Interaction** - Deploy, call, and monitor Clarity smart contracts on the Stacks blockchain
- **NFT Operations** - Manage non-fungible tokens including minting, transfers, and metadata retrieval
- **Token Management** - Handle fungible token operations, balances, and transfers
- **Stacking Integration** - Access Bitcoin yield through Stacking delegation and pool operations
- **Transaction Processing** - Submit, monitor, and analyze blockchain transactions
- **Block Data Access** - Retrieve block information, heights, and chain data
- **BNS Name Services** - Interact with Bitcoin Name System for decentralized naming
- **Real-time Monitoring** - Track blockchain events and state changes

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
| API Key | Your Stacks API key for authenticated requests | Yes |
| Network | Target network (mainnet, testnet) | Yes |
| API Endpoint | Custom API endpoint URL (optional) | No |

## Resources & Operations

### 1. Transactions

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by ID |
| Get Transactions | List transactions with filtering options |
| Submit Transaction | Broadcast a signed transaction to the network |
| Get Transaction Events | Fetch events associated with a transaction |
| Get Mempool Stats | Retrieve mempool statistics |
| Get Fee Estimate | Estimate transaction fees |

### 2. Smart Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new Clarity smart contract |
| Call Contract Function | Execute a contract function call |
| Get Contract Info | Retrieve contract metadata and source |
| Get Contract Events | Fetch events emitted by a contract |
| Get Contract Interface | Get contract's public function interface |
| Get Contract Source | Retrieve contract source code |

### 3. Non-Fungible Tokens

| Operation | Description |
|-----------|-------------|
| Get NFT Holdings | Retrieve NFTs owned by an address |
| Get NFT History | Fetch transfer history for an NFT |
| Get NFT Metadata | Retrieve NFT metadata and properties |
| Get Collection Info | Get information about an NFT collection |
| Transfer NFT | Transfer NFT ownership |
| Mint NFT | Create new NFT tokens |

### 4. Stacking

| Operation | Description |
|-----------|-------------|
| Get Stacking Info | Retrieve current stacking cycle information |
| Delegate STX | Delegate STX tokens for stacking |
| Get Delegator Info | Fetch delegation details for an address |
| Get Pool Members | List members of a stacking pool |
| Get Reward Slots | Retrieve reward slot information |
| Stack STX | Stack STX tokens directly |

### 5. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by height or hash |
| Get Blocks | List blocks with pagination |
| Get Latest Block | Get the most recent block |
| Get Block Transactions | Fetch transactions in a specific block |
| Get Burn Blocks | Retrieve Bitcoin burn block information |

### 6. Names

| Operation | Description |
|-----------|-------------|
| Get Name Info | Retrieve BNS name registration details |
| Get Names | List registered names with filtering |
| Get Namespace Info | Fetch namespace configuration |
| Get Name History | Retrieve name transfer and update history |
| Resolve Name | Resolve BNS name to zone file data |
| Get Subdomains | List subdomains for a given name |

### 7. Fungible Tokens

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Retrieve token balance for an address |
| Get Token Info | Fetch token metadata and supply information |
| Get Token Holders | List addresses holding a specific token |
| Transfer Tokens | Transfer fungible tokens between addresses |
| Get Token Transfers | Fetch transfer history for a token |
| Get Account Balances | Retrieve all token balances for an address |

## Usage Examples

```javascript
// Deploy a smart contract
{
  "resource": "SmartContracts",
  "operation": "Deploy Contract",
  "contractName": "my-token",
  "sourceCode": "(define-fungible-token my-token)",
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

```javascript
// Stack STX tokens
{
  "resource": "Stacking",
  "operation": "Stack STX",
  "amount": "1000000000",
  "poxAddress": "1Xik14zRm29UsyS6DjhYg4iZeZqsDa8D3",
  "cycles": "12",
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

```javascript
// Get NFT holdings
{
  "resource": "NonFungibleTokens",
  "operation": "Get NFT Holdings",
  "address": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "limit": "50",
  "offset": "0"
}
```

```javascript
// Submit transaction
{
  "resource": "Transactions",
  "operation": "Submit Transaction",
  "txHex": "0x808000000004...",
  "attachment": "0x123456"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in credential configuration |
| Network Unavailable | Cannot connect to Stacks network | Check network selection and API endpoint |
| Transaction Failed | Transaction rejected by network | Review transaction parameters and account balance |
| Contract Not Found | Smart contract does not exist at specified address | Verify contract address and deployment status |
| Insufficient Balance | Account lacks sufficient STX for operation | Check account balance and reduce transaction amount |
| Invalid Address Format | Provided address is malformed | Ensure address follows Stacks address format (SP/ST prefix) |

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
- **Stacks Community**: [discord.gg/stacks](https://discord.gg/stacks)