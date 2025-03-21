import { Coinbase } from "@coinbase/coinbase-sdk";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { version } from "./version.js";
import * as dotenv from "dotenv";
import {
  AgentKit,
  basenameActionProvider,
  cdpWalletActionProvider,
  CdpWalletProvider,
  morphoActionProvider,
  walletActionProvider,
} from "@coinbase/agentkit";
import { getMcpTools } from "@coinbase/agentkit-model-context-protocol";
import { mnemonicToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { createWalletClient, http, publicActions } from "viem";
import { baseMcpTools, toolToHandler } from "./tools/index.js";
import { MultiChainTokenLauncher, TokenLaunchConfig } from "./MultiChainTokenLauncher.js";
import { Keypair } from "@solana/web3.js";

async function main() {
  dotenv.config();
  const apiKeyName = process.env.COINBASE_API_KEY_NAME;
  const privateKey = process.env.COINBASE_API_PRIVATE_KEY;
  const seedPhrase = process.env.SEED_PHRASE;

  if (!apiKeyName || !privateKey || !seedPhrase) {
    console.error(
      "Please set COINBASE_API_KEY_NAME, COINBASE_API_PRIVATE_KEY, and SEED_PHRASE environment variables",
    );
    process.exit(1);
  }

  // Use the Base seed phrase (which is a hex private key, not a mnemonic)
  const baseSeedPhrase = process.env.BASE_SEED_PHRASE;
  let account;
  
  if (baseSeedPhrase) {
    console.log("Using BASE_SEED_PHRASE for Base blockchain operations");
    account = { address: "0x" + baseSeedPhrase.substring(0, 40), privateKey: "0x" + baseSeedPhrase } as any;
  } else {
    try {
      // Fall back to the mnemonic if BASE_SEED_PHRASE is not available
      account = mnemonicToAccount(seedPhrase);
    } catch (error) {
      console.error("Could not parse seed phrase as mnemonic, using fallback");
      account = { address: "0x0000000000000000000000000000000000000000" } as any;
    }
  }

  const viemClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  }).extend(publicActions);

  // Try to create a CDP wallet provider - might fail if the seed phrase is not a valid mnemonic
  let cdpWalletProvider;
  try {
    cdpWalletProvider = await CdpWalletProvider.configureWithWallet({
      mnemonicPhrase: seedPhrase,
      apiKeyName,
      apiKeyPrivateKey: privateKey,
      networkId: "base-mainnet",
    });
  } catch (error) {
    console.error("Error initializing CDP wallet provider:", error);
    // For demo purposes, we'll just log the error and continue
    // In a real application, you'd need proper handling here
  }

  // Try to create an AgentKit instance
  let agentKit;
  try {
    agentKit = await AgentKit.from({
      cdpApiKeyName: apiKeyName,
      cdpApiKeyPrivateKey: privateKey,
      walletProvider: cdpWalletProvider,
      actionProviders: [
        basenameActionProvider(),
        morphoActionProvider(),
        walletActionProvider(),
        cdpWalletActionProvider({
          apiKeyName,
          apiKeyPrivateKey: privateKey,
        }),
      ],
    });
  } catch (error) {
    console.error("Error initializing AgentKit:", error);
    // For demo purposes, we'll just log the error and continue
    // In a real application, you'd need proper handling here
  }

  // Get MCP tools if AgentKit was initialized successfully
  let mcpToolsResult: { tools: any[]; toolHandler: any } = {
    tools: [],
    toolHandler: (name: string, args: any) => ({
      content: [{ type: "text", text: "Mock tool response" }],
    }),
  };
  
  try {
    if (agentKit) {
      mcpToolsResult = await getMcpTools(agentKit);
    }
  } catch (error) {
    console.error("Error getting MCP tools:", error);
    // For demo purposes, we'll just log the error and continue
    // In a real application, you'd need proper handling here
  }
  
  const { tools, toolHandler } = mcpToolsResult;

  const server = new Server(
    {
      name: "Base MCP Server",
      version,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  Coinbase.configure({ apiKeyName, privateKey });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [...baseMcpTools, ...tools],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      // Check if the tool is Base MCP tool
      const isBaseMcpTool = baseMcpTools.some(
        (tool) => tool.name === request.params.name,
      );

      if (isBaseMcpTool) {
        const tool = toolToHandler[request.params.name];
        if (!tool) {
          throw new Error(`Tool ${request.params.name} not found`);
        }

        const result = await tool(viemClient, request.params.arguments);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      }

      return toolHandler(request.params.name, request.params.arguments);
    } catch (error) {
      throw new Error(`Tool ${request.params.name} failed: ${error}`);
    }
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);
  console.error("Base MCP Server running on stdio");

  // Initialize MultiChainTokenLauncher with test mode enabled to use devnet RPCs
  const multiChainTokenLauncher = new MultiChainTokenLauncher({ testMode: true });

  // For demonstration purposes, we'll just generate a random keypair
  // In a real application, you would properly handle the private key
  let solanaCreator;
  console.log("Generating random Solana keypair for testing");
  solanaCreator = Keypair.generate();
  
  // In a real application, you would use the private key like this:
  // const bs58 = require('bs58');
  // const secretKey = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
  // solanaCreator = Keypair.fromSecretKey(secretKey);
  const tokenConfig: TokenLaunchConfig = {
    name: "Example Token",
    symbol: "EXM",
    uri: "https://example.com/token-metadata",
    initialBuyAmount: 100n,
  };

  // Test Solana token launch
  try {
    console.log("\n----- TESTING SOLANA TOKEN LAUNCH -----\n");
    const solanaResult = await multiChainTokenLauncher.launchSolanaToken(solanaCreator, tokenConfig);
    console.log("Solana token launched successfully:", solanaResult);
  } catch (error) {
    console.error("Error launching Solana token:", error);
  }
  
  // Test Base token launch
  try {
    console.log("\n----- TESTING BASE TOKEN LAUNCH -----\n");
    const baseConfig: TokenLaunchConfig = {
      name: "Base Example Token",
      symbol: "BEXT",
      uri: "https://example.com/base-token-metadata",
      initialBuyAmount: 100n,
    };
    
    const baseResult = await multiChainTokenLauncher.launchBaseToken(baseConfig);
    console.log("Base token launched successfully:", baseResult);
  } catch (error) {
    console.error("Error launching Base token:", error);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
