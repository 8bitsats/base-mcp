import { Keypair } from "@solana/web3.js";
import { MultiChainTokenLauncher } from "../src/MultiChainTokenLauncher";

async function main() {
  // Initialize the launcher with test mode for devnet
  const launcher = new MultiChainTokenLauncher({
    testMode: true,
    solanaEndpoint: "https://api.devnet.solana.com"
  });

  // Create a test keypair (in production, use your actual keypair)
  const creator = Keypair.generate();

  // Token configuration
  const tokenConfig = {
    name: "Test Token",
    symbol: "TEST",
    uri: "https://example.com/metadata.json",
    initialBuyAmount: 1n, // 1 SOL initial buy
    description: "A test token on Solana devnet",
    website: "https://example.com",
    twitter: "@example",
    telegram: "@example",
    testMode: true
  };

  try {
    // Launch the token
    const result = await launcher.launchSolanaToken(creator, tokenConfig);

    if (result.success) {
      console.log("Token launched successfully!");
      console.log("Transaction Hash:", result.transactionHash);
      console.log("Mint Address:", result.mint);
      console.log("Metadata:", result.metadata);
    } else {
      console.error("Failed to launch token:", result.error);
    }
  } catch (error) {
    console.error("Error launching token:", error);
  }
}

main().catch(console.error);
