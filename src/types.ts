import React, { FormEvent } from "react";
import { ProjectFile } from "./contractsCode";

export interface NavbarProps {
  language: "fa" | "en";
  setLanguage: React.Dispatch<React.SetStateAction<"fa" | "en">>;
  walletConnected: boolean;
  userAddress: string;
  userBalance: string;
  currentSymbol: string;
  walletLoading: boolean;
  connectWallet: () => Promise<void>;
  showAdmin: boolean;
  setShowAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  dexTab: "swap" | "liquidity";
  setDexTab: React.Dispatch<React.SetStateAction<"swap" | "liquidity">>;
}

export interface SwapTabProps {
  language: "fa" | "en";
  currentSymbol: string;
  explorerUrl: string;
  walletConnected: boolean;
  swapType: "eth_to_tokens" | "tokens_to_tokens";
  setSwapType: React.Dispatch<React.SetStateAction<"eth_to_tokens" | "tokens_to_tokens">>;
  swapAmountIn: string;
  setSwapAmountIn: React.Dispatch<React.SetStateAction<string>>;
  swapAmountOutMin: string;
  setSwapAmountOutMin: React.Dispatch<React.SetStateAction<string>>;
  swapTokenIn: string;
  setSwapTokenIn: React.Dispatch<React.SetStateAction<string>>;
  swapTokenOut: string;
  setSwapTokenOut: React.Dispatch<React.SetStateAction<string>>;
  token0Address: string;
  token1Address: string;
  wethAddress?: string;
  swapTxMining: boolean;
  approveTxMining: boolean;
  swapTxHash: string;
  approveTxHash: string;
  swapStatusText: string;
  triggerApproveForSwap: () => Promise<void>;
  triggerExecuteSwap: (e: FormEvent) => Promise<void>;
}

export interface LiquidityTabProps {
  language: "fa" | "en";
  walletConnected: boolean;
  explorerUrl: string;
  queryLoading: boolean;
  pairAddressResult: string;
  reserve0Result: string;
  reserve1Result: string;
  poolStatusText: string;
  queryOnChainPair: () => Promise<void>;
  pairTokenA: string;
  setPairTokenA: React.Dispatch<React.SetStateAction<string>>;
  pairTokenB: string;
  setPairTokenB: React.Dispatch<React.SetStateAction<string>>;
  txMining: boolean;
  txHashResult: string;
  triggerCreatePairOnChain: (e: FormEvent) => Promise<void>;
}

export interface AdminPanelProps {
  language: "fa" | "en";
  rpcUrl: string;
  setRpcUrl: React.Dispatch<React.SetStateAction<string>>;
  chainId: number;
  setChainId: React.Dispatch<React.SetStateAction<number>>;
  wethAddress: string;
  setWethAddress: React.Dispatch<React.SetStateAction<string>>;
  feeSetter: string;
  setFeeSetter: React.Dispatch<React.SetStateAction<string>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  factoryAddress: string;
  setFactoryAddress: React.Dispatch<React.SetStateAction<string>>;
  routerAddress: string;
  setRouterAddress: React.Dispatch<React.SetStateAction<string>>;
  token0Address: string;
  setToken0Address: React.Dispatch<React.SetStateAction<string>>;
  token1Address: string;
  setToken1Address: React.Dispatch<React.SetStateAction<string>>;
  addTaQoinNetwork: () => Promise<void>;
  currentSymbol: string;
  explorerUrl: string;
  files: ProjectFile[];
  selectedFileIndex: number;
  setSelectedFileIndex: React.Dispatch<React.SetStateAction<number>>;
  copiedFileIndex: number | null;
  handleCopyCode: (content: string, index: number) => void;
  activeFile: ProjectFile;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  chatHistory: Array<{ sender: "user" | "ai"; text: string }>;
  aiLoading: boolean;
  handleAskAI: (e?: FormEvent) => Promise<void>;
  setQuestionSnippet: (conceptKey: string) => void;
}
