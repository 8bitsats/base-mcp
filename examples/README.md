# Multi-Chain Token Launcher Examples

This directory contains examples demonstrating how to use the Multi-Chain Token Launcher to create tokens on both Solana and Base networks.

## Prerequisites

Before running the examples, make sure you have:

1. Node.js and npm/yarn installed
2. Required environment variables set up:
   - For Base network:
     ```
     SEED_PHRASE=your_wallet_seed_phrase
     COINBASE_API_KEY_NAME=your_api_key_name
     COINBASE_API_PRIVATE_KEY=your_api_private_key
     ```
   - For Solana network (optional, only if using mainnet):
     - Your wallet keypair file

## Examples

### 1. Launch Solana Token

The `launch_solana_token.ts` example demonstrates:
- Creating a token on Solana devnet/mainnet
- Setting token metadata (name, symbol, URI)
- Performing an initial buy
- Error handling and result validation

```bash
# Run on devnet (test mode)
ts-node examples/launch_solana_token.ts

# For mainnet, modify the testMode config in the example
```

### 2. Launch Base Token

The `launch_base_token.ts` example demonstrates:
- Creating a token on Base network
- Setting token metadata and initial supply
- Using CDP Wallet Provider for Base transactions
- Error handling and result validation

```bash
# Run on Base testnet
ts-node examples/launch_base_token.ts

# For mainnet, modify the testMode config in the example
```

## Testing Options

We support three testing approaches:

1. **Simple Mock Test**
   - Uses simulated transactions
   - No blockchain connection required
   - Quick development verification

2. **Test Mode on Devnet**
   - Uses randomly generated keypair
   - Real transactions on test networks
   - No real funds required

3. **Real Token Launch**
   - Devnet: Test with actual transactions
   - Mainnet: Launch real tokens
   - Requires proper setup and funds

## Validation and Error Handling

Both examples include built-in validation for:
- Token name (≤ 32 characters)
- Symbol (≤ 10 characters)
- URI format validation
- Initial buy/supply amount validation
- Network-specific parameter validation

## Additional Resources

- For Solana-specific examples, check the `pumpfun-raydium-cli-tools-main/examples` directory
- For Base-specific examples, refer to the AgentKit documentation
- See `TESTING.md` for detailed testing instructions

## Important Notes

1. Always test on devnet/testnet first
2. Keep your private keys and API credentials secure
3. Verify all token parameters before launching
4. Monitor transaction status and handle errors appropriately

## Error Handling

Both launchers provide detailed error information:
- Transaction hash (if available)
- Error message and type
- Network-specific error details

Example error handling:
```typescript
try {
  const result = await launcher.launchSolanaToken(creator, config);
  if (!result.success) {
    console.error("Launch failed:", result.error);
  }
} catch (error) {
  console.error("Unexpected error:", error);
}
```
