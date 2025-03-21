import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  buyOpenRouterCreditsHandler,
  callContractHandler,
  erc20BalanceHandler,
  erc20TransferHandler,
  getMorphoVaultsHandler,
  getOnrampAssetsHandler,
  onrampHandler,
} from "./handlers.js";
import { Coinbase } from "@coinbase/coinbase-sdk";

const getMorphoVaultsTool: Tool = {
  name: "get_morpho_vaults",
  description: "Get the vaults for a given asset",
  inputSchema: {
    type: "object",
    properties: {
      assetSymbol: {
        type: "string",
        description: "Asset symbol by which to filter vaults",
      },
    },
  },
};

export type GetMorphoVaultsToolParams = {
  assetSymbol: string;
};

const callContractTool: Tool = {
  name: "call_contract",
  description: "Call a contract function",
  inputSchema: {
    type: "object",
    properties: {
      contractAddress: {
        type: "string",
        description: "The address of the contract to call",
      },
      functionName: {
        type: "string",
        description: "The name of the function to call",
      },
      functionArgs: {
        type: "array",
        description: "The arguments to pass to the function",
        items: {
          type: "string",
        },
      },
      abi: {
        type: "string",
        description: "The ABI of the contract",
      },
    },
  },
};

const getOnrampAssetsTool: Tool = {
  name: "get_onramp_assets",
  description:
    "Get the assets available for onramping in a given country / subdivision",
  inputSchema: {
    type: "object",
    properties: {
      country: {
        type: "string",
        description:
          "ISO 3166-1 two-digit country code string representing the purchasing user's country of residence, e.g., US.",
      },
      subdivision: {
        type: "string",
        description:
          "ISO 3166-2 two-digit country subdivision code representing the purchasing user's subdivision of residence within their country, e.g. NY. Required if the country=“US” because certain states (e.g., NY) have state specific asset restrictions.",
      },
    },
  },
};

const onrampTool: Tool = {
  name: "onramp",
  description: "Get a URL for onramping funds",
  inputSchema: {
    type: "object",
    properties: {
      amountUsd: {
        type: "number",
        description: "The amount of funds to onramp",
      },
      assetId: {
        type: "string",
        enum: Object.values(Coinbase.assets),
        description: "The asset ID to onramp",
      },
    },
  },
};

const erc20BalanceTool: Tool = {
  name: "erc20_balance",
  description: "Get the balance of an ERC20 token",
  inputSchema: {
    type: "object",
    properties: {
      contractAddress: {
        type: "string",
        description: "The address of the contract to get the balance of",
      },
    },
  },
};

const erc20TransferTool: Tool = {
  name: "erc20_transfer",
  description: "Transfer an ERC20 token",
  inputSchema: {
    type: "object",
    properties: {
      contractAddress: {
        type: "string",
        description: "The address of the contract to transfer the token from",
      },
      toAddress: {
        type: "string",
        description: "The address of the recipient",
      },
      amount: {
        type: "string",
        description: "The amount of tokens to transfer",
      },
    },
  },
};

const buyOpenRouterCreditsTool: Tool = {
  name: "buy_openrouter_credits",
  description: "Buy OpenRouter credits with USDC",
  inputSchema: {
    type: "object",
    properties: {
      amountUsd: {
        type: "number",
        description: "The amount of credits to buy, in USD",
      },
    },
  },
};

const launchSolanaTokenTool: Tool = {
  name: "launch_solana_token",
  description: "Launch a token on Solana",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Token name" },
      symbol: { type: "string", description: "Token symbol" },
      uri: { type: "string", description: "Metadata URI" },
      initialBuyAmount: { type: "string", description: "Initial buy amount" },
    },
    required: ["name", "symbol", "uri"],
  },
};

const launchBaseTokenTool: Tool = {
  name: "launch_base_token",
  description: "Launch a token on Base",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Token name" },
      symbol: { type: "string", description: "Token symbol" },
      uri: { type: "string", description: "Metadata URI" },
      initialBuyAmount: { type: "string", description: "Initial buy amount" },
    },
    required: ["name", "symbol", "uri"],
  },
};

export const baseMcpTools: Tool[] = [
  getMorphoVaultsTool,
  callContractTool,
  getOnrampAssetsTool,
  onrampTool,
  erc20BalanceTool,
  erc20TransferTool,
  buyOpenRouterCreditsTool,
  launchSolanaTokenTool,
  launchBaseTokenTool,
];

import { MultiChainTokenLauncher } from "../MultiChainTokenLauncher.js";

// biome-ignore lint/complexity/noBannedTypes: temp
export const toolToHandler: Record<string, Function> = {
  get_morpho_vaults: getMorphoVaultsHandler,
  call_contract: callContractHandler,
  get_onramp_assets: getOnrampAssetsHandler,
  onramp: onrampHandler,
  erc20_balance: erc20BalanceHandler,
  erc20_transfer: erc20TransferHandler,
  buyOpenRouterCredits: buyOpenRouterCreditsHandler,
  launch_solana_token: async (viemClient: any, args: any) => {
    console.log("launch_solana_token handler called with args:", args);
    const multiChainTokenLauncher = new MultiChainTokenLauncher({ testMode: true });
    const result = await multiChainTokenLauncher.launchSolanaToken({} as any, args);
    console.log("launch_solana_token result:", result);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
  launch_base_token: async (viemClient: any, args: any) => {
    console.log("launch_base_token handler called with args:", args);
    const multiChainTokenLauncher = new MultiChainTokenLauncher({ testMode: true });
    const result = await multiChainTokenLauncher.launchBaseToken(args);
    console.log("launch_base_token result:", result);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
};
