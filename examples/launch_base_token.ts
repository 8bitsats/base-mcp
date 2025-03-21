import { MultiChainTokenLauncher } from "../src/MultiChainTokenLauncher";

async function main() {
  // Load environment variables
  if (!process.env.SEED_PHRASE || !process.env.COINBASE_API_KEY_NAME || !process.env.COINBASE_API_PRIVATE_KEY) {
    throw new Error("Missing required environment variables. Please set SEED_PHRASE, COINBASE_API_KEY_NAME, and COINBASE_API_PRIVATE_KEY");
  }

  // Initialize the launcher
  const launcher = new MultiChainTokenLauncher({
    testMode: true // Use Base testnet
  });

  // Token configuration
  const tokenConfig = {
    name: "Test Base Token",
    symbol: "BTEST",
    uri: "https://example.com/metadata.json",
    initialBuyAmount: 1n, // 1 ETH initial supply
    description: "A test token on Base network",
    website: "https://example.com",
    twitter: "@example",
    telegram: "@example",
    network: "base" as const,
    testMode: true
  };

  try {
    // Launch the token
    const result = await launcher.launchBaseToken(tokenConfig);

    if (result.success) {
      console.log("Token launched successfully!");
      console.log("Transaction Hash:", result.transactionHash);
      console.log("Contract Address:", result.contractAddress);
      console.log("Metadata:", result.metadata);
    } else {
      console.error("Failed to launch token:", result.error);
    }
  } catch (error) {
    console.error("Error launching token:", error);
  }
}

main().catch(console.error);
