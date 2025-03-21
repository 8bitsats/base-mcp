# Base-MCP: Multi-Chain Token Launch Server

This MCP server provides tools for launching tokens on both Solana and Base blockchains. It's designed to work with Claude AI to simplify the token creation process across multiple blockchains.

## Setup

1. Ensure Node.js and npm are installed
2. Run `npm install` to install dependencies
3. Build the project: `npm run build`
4. Start the server: `npm run start`

## MCP Configuration

The MCP server is configured in `mcp_config.json`. This file contains all necessary environment variables and settings for the server to operate.

### Environment Variables

- `COINBASE_API_KEY_NAME`, `COINBASE_API_PRIVATE_KEY`: Credentials for Coinbase API
- `SEED_PHRASE`: Mnemonic for wallet initialization
- `BASE_SEED_PHRASE`: Private key for Base blockchain operations
- `SOLANA_PRIVATE_KEY`: Private key for Solana blockchain operations
- `BASE_DEVNET_RPC_URL`: URL for Base testnet (Sepolia)
- `SOLANA_DEVNET_RPC_URL`: URL for Solana devnet

## Available Tools

### 1. `launch_solana_token`

Creates a new token on the Solana blockchain.

**Parameters:**
- `name`: Token name (e.g., "Example Token")
- `symbol`: Token ticker symbol (e.g., "EXM")
- `uri`: Metadata URI for the token
- `initialBuyAmount`: Initial amount to mint (optional)
- `testMode`: Set to true to use devnet (default: true)

**Example:**
```json
{
  "name": "Example Token",
  "symbol": "EXM",
  "uri": "https://example.com/token-metadata",
  "initialBuyAmount": "100"
}
```

### 2. `launch_base_token`

Creates a new token on the Base blockchain.

**Parameters:**
- `name`: Token name (e.g., "Base Example Token")
- `symbol`: Token ticker symbol (e.g., "BEXT")
- `uri`: Metadata URI for the token
- `initialBuyAmount`: Initial amount to mint (optional)
- `testMode`: Set to true to use devnet (default: true)

**Example:**
```json
{
  "name": "Base Example Token",
  "symbol": "BEXT",
  "uri": "https://example.com/base-token-metadata",
  "initialBuyAmount": "100"
}
```

## Using with Claude

To interact with this MCP server in Claude:

1. Ensure the server is running: `npm run start`
2. In Claude, use the `use_mcp_tool` command to execute the token launch operations:

```
<use_mcp_tool>
<server_name>base-mcp</server_name>
<tool_name>launch_solana_token</tool_name>
<arguments>
{
  "name": "My Token",
  "symbol": "MYT",
  "uri": "https://example.com/token-metadata",
  "initialBuyAmount": "1000"
}
</arguments>
</use_mcp_tool>
```

## Development Mode

The server automatically operates in test mode, using devnet/testnet for both Solana and Base blockchains. This is safer for testing and doesn't involve real funds.

## Troubleshooting

- If you encounter authentication errors with Coinbase API, verify your API credentials.
- For wallet-related errors, check that your seed phrases and private keys are correctly formatted.
- RPC connection issues might indicate network problems or incorrect endpoint URLs.

## License

See LICENSE file for details.
