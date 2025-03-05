import type { Coinbase } from "@coinbase/coinbase-sdk";

export type TransferFundsParams = {
  destination: string;
  assetId: string;
  amount: number;
};

export type DeployContractParams = {
  constructorArgs: string[];
  contractName: string;
  solidityInputJson: string;
  solidityVersion: string;
};
