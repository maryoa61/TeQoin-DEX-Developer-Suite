/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from "react";
import { ethers } from "ethers";
import { getProjectFiles } from "./contractsCode";
import { Navbar } from "./components/Navbar";
import { SwapTab } from "./components/SwapTab";
import { LiquidityTab } from "./components/LiquidityTab";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  // Config state (Dynamic environment params)
  const [rpcUrl, setRpcUrl] = useState("https://rpc.teqoin.io");
  const [chainId, setChainId] = useState(420377);
  const [wethAddress, setWethAddress] = useState("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  const [feeSetter, setFeeSetter] = useState("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [projectName, setProjectName] = useState("teqoin-dex");
  
  // App navigation & layout state
  const [dexTab, setDexTab] = useState<"swap" | "liquidity">("swap");
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  
  // Selection/Copy logs within code workspace
  const [selectedFileIndex, setSelectedFileIndex] = useState(3); // Start near Solidity Factory file
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState<"fa" | "en">("fa");

  // Real-World Web3 State (Ethers v6)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [currentNetworkId, setCurrentNetworkId] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [web3StatusMsg, setWeb3StatusMsg] = useState("");

  // DEX Interact State
  const [factoryAddress, setFactoryAddress] = useState("0x16A8861a12E3135e8Db32b4198d90c6100f28737");
  const [routerAddress, setRouterAddress] = useState("0x64c0481600d7C77FA113011Fc3d854b68766C311");
  const [token0Address, setToken0Address] = useState("0x6cC35D27dEc15F8adeC439cD969989B0b03D5979");
  const [token1Address, setToken1Address] = useState("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  
  // Dynamic On-chain fetch results
  const [queryLoading, setQueryLoading] = useState(false);
  const [pairAddressResult, setPairAddressResult] = useState("");
  const [reserve0Result, setReserve0Result] = useState("");
  const [reserve1Result, setReserve1Result] = useState("");
  const [poolStatusText, setPoolStatusText] = useState("");

  // Write contract states
  const [pairTokenA, setPairTokenA] = useState("");
  const [pairTokenB, setPairTokenB] = useState("");
  const [txMining, setTxMining] = useState(false);
  const [txHashResult, setTxHashResult] = useState("");

  // Swap states
  const [swapType, setSwapType] = useState<"eth_to_tokens" | "tokens_to_tokens">("eth_to_tokens");
  const [swapAmountIn, setSwapAmountIn] = useState("0.05");
  const [swapTokenIn, setSwapTokenIn] = useState("0x6cC35D27dEc15F8adeC439cD969989B0b03D5979");
  const [swapTokenOut, setSwapTokenOut] = useState("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  const [swapAmountOutMin, setSwapAmountOutMin] = useState("0");
  const [swapTxMining, setSwapTxMining] = useState(false);
  const [approveTxMining, setApproveTxMining] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState("");
  const [approveTxHash, setApproveTxHash] = useState("");
  const [swapStatusText, setSwapStatusText] = useState("");

  // AI Assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { 
      sender: "ai", 
      text: "سلام! من مشاور ارشد و دستیار هوشمند اتوماسیون TeQoin هستم. تمام فایل‌های سالیدیتی پروژه هادی هاردست در دایرکتوری واقعی شما شامل `contracts/UniswapV2Factory.sol` و `contracts/UniswapV2Router02.sol` ایجاد شده‌اند و آماده کامپایل و بیلد گیت‌هاب می‌باشند. آماده‌ام به هر سوال فنی درباره مبادلات واقعی، تنظیمات متامسک یا فرآیند دیپلوی خودکار پاسخ دهم." 
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Generate customized files based on user variables
  const files = getProjectFiles({ rpcUrl, chainId, wethAddress, feeSetter, projectName });
  const activeFile = files[selectedFileIndex] || files[0];

  const isL2 = chainId === 420377;
  const currentSymbol = isL2 ? "ETH" : "TEQ";
  const explorerUrl = isL2 ? "https://testnet-blockscan.teqoin.io/" : "https://explorer.teqoin.com";

  // Check Metamask state on mount
  useEffect(() => {
    checkMetaMaskOnMount();
  }, []);

  const checkMetaMaskOnMount = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const tempProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await tempProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const network = await tempProvider.getNetwork();
          const targetBal = await tempProvider.getBalance(accounts[0]);
          
          setProvider(tempProvider);
          setUserAddress(accounts[0]);
          setUserBalance(ethers.formatEther(targetBal));
          setCurrentNetworkId(Number(network.chainId));
          setWalletConnected(true);
        }
      } catch (err) {
        console.error("MetaMask initial check failed:", err);
      }
    }
  };

  // Connect wallet interface
  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setWeb3StatusMsg(language === "fa" ? "کیف پول MetaMask شناسایی نشد. لطفاً اکستنشن مرورگر آن را نصب کنید." : "MetaMask wallet not found. Please install the browser extension.");
      return;
    }

    setWalletLoading(true);
    setWeb3StatusMsg("");
    try {
      const tempProvider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await tempProvider.send("eth_requestAccounts", []);
      const signer = await tempProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await tempProvider.getBalance(address);
      const network = await tempProvider.getNetwork();

      setProvider(tempProvider);
      setUserAddress(address);
      setUserBalance(ethers.formatEther(balance));
      setCurrentNetworkId(Number(network.chainId));
      setWalletConnected(true);
      setWeb3StatusMsg("");
    } catch (err: any) {
      console.error(err);
      setWeb3StatusMsg(language === "fa" ? `خطا در اتصال کیف پول: ${err.message}` : `Wallet connection error: ${err.message}`);
    } finally {
      setWalletLoading(false);
    }
  };

  // Auto-Inject/setup TeQoin RPC in MetaMask securely with 1 click
  const addTaQoinNetwork = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert(language === "fa" ? "لطفاً ابتدا متامسک را نصب کنید." : "Please install MetaMask first.");
      return;
    }

    try {
      const hexChainId = "0x" + chainId.toString(16);
      const isL2 = chainId === 420377;
      const networkName = isL2 ? "TeQoin L2" : "TaQoin Testnet";
      const currencySymbol = isL2 ? "ETH" : "TEQ";
      const expUrl = isL2 ? "https://testnet-blockscan.teqoin.io/" : "https://explorer.teqoin.com";

      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: networkName,
            rpcUrls: [rpcUrl.trim()],
            nativeCurrency: { name: currencySymbol, symbol: currencySymbol, decimals: 18 },
            blockExplorerUrls: [expUrl]
          }
        ]
      });
      if (provider) {
        const net = await provider.getNetwork();
        setCurrentNetworkId(Number(net.chainId));
      }
    } catch (err: any) {
      console.error(err);
      alert("Error adding network: " + err.message);
    }
  };

  // Query On-chain factory pair address & pool reserves directly on TeQoin testnet!
  const queryOnChainPair = async () => {
    setQueryLoading(true);
    setPairAddressResult("");
    setReserve0Result("");
    setReserve1Result("");
    setPoolStatusText("");

    try {
      const tempRpcProvider = new ethers.JsonRpcProvider(rpcUrl.trim());
      
      const factoryContract = new ethers.Contract(
        factoryAddress.trim(),
        ["function getPair(address tokenA, address tokenB) external view returns (address pair)"],
        tempRpcProvider
      );

      setPoolStatusText(language === "fa" ? "در حال بررسی وضعیت جفت در بلاکچین تستی..." : "Querying reserves metadata index from block...");
      const pair = await factoryContract.getPair(token0Address.trim(), token1Address.trim());
      
      if (!pair || pair === ethers.ZeroAddress) {
        setPairAddressResult(ethers.ZeroAddress);
        setPoolStatusText(language === "fa" ? "این جفت لایه‌نقدینگی هنوز ایجاد نشده است." : "This liquidity pair does not exist yet.");
        setQueryLoading(false);
        return;
      }

      setPairAddressResult(pair);

      const pairContract = new ethers.Contract(
        pair,
        [
          "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
          "function token0() external view returns (address)"
        ],
        tempRpcProvider
      );

      const [res0, res1] = await pairContract.getReserves();
      
      let formattedRes0 = ethers.formatEther(res0);
      let formattedRes1 = ethers.formatEther(res1);

      setReserve0Result(formattedRes0);
      setReserve1Result(formattedRes1);
      setPoolStatusText(language === "fa" ? "اطلاعات استخر با ذخایر زنده با موفقیت دریافت شد!" : "Liquidity pair reserves queried successfully!");
    } catch (err: any) {
      console.error(err);
      setPoolStatusText(language === "fa" ? `خطای بررسی استخر: ${err.message}. لطفا از وجود استخر در این آدرس اطمینان حاصل کنید.` : `Pool Query Error: ${err.message}`);
    } finally {
      setQueryLoading(false);
    }
  };

  // On-Chain Transaction: Create Pair via connected MetaMask wallet!
  const triggerCreatePairOnChain = async (e: FormEvent) => {
    e.preventDefault();
    if (!walletConnected || !provider) {
      alert(language === "fa" ? "لطفاً ابتدا کیف پول خود را متصل کنید." : "Please connect your wallet first.");
      return;
    }

    if (!pairTokenA || !pairTokenB) {
      alert(language === "fa" ? "هر دو آدرس توکن الزامی هستند." : "Both token addresses are required.");
      return;
    }

    setTxMining(true);
    setTxHashResult("");

    try {
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(
        factoryAddress.trim(),
        ["function createPair(address tokenA, address tokenB) external returns (address pair)"],
        signer
      );

      const tx = await factoryContract.createPair(pairTokenA.trim(), pairTokenB.trim());
      setTxHashResult(tx.hash);
      
      await tx.wait();
      alert(language === "fa" ? "تراکنش با موفقیت ماین شد و جفت استخر تشکیل گردید!" : "Liquidity pair contract created successfully on MetaMask!");
    } catch (err: any) {
      console.error(err);
      alert(language === "fa" ? `خطا در باز و اجرای تراکنش: ${err.message}` : `Tx Execution Error: ${err.message}`);
    } finally {
      setTxMining(false);
    }
  };

  // Swap trigger handler: ERC20 approve
  const triggerApproveForSwap = async () => {
    if (!walletConnected || !provider) {
      alert(language === "fa" ? "لطفاً ابتدا کیف پول خود را متصل کنید." : "Please connect your wallet first.");
      return;
    }
    if (!swapTokenIn) {
      alert(language === "fa" ? "آدرس توکن ورودی الزامی است." : "Input token address is required.");
      return;
    }
    setApproveTxMining(true);
    setSwapStatusText("");
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        swapTokenIn.trim(),
        ["function approve(address spender, uint256 amount) external returns (bool)"],
        signer
      );
      const amountToApprove = ethers.parseUnits(swapAmountIn || "1000", 18);
      const tx = await tokenContract.approve(routerAddress.trim(), amountToApprove);
      setApproveTxHash(tx.hash);
      setSwapStatusText(language === "fa" ? "تراکنش تاییدیه (Approve) ارسال شد. منتظر تایید..." : "Approve transaction broadcasted. Waiting for confirmation...");
      await tx.wait();
      setSwapStatusText(language === "fa" ? "تاییدیه با موفقیت انجام شد!" : "Token approval completed successfully!");
    } catch (err: any) {
      console.error(err);
      setSwapStatusText(language === "fa" ? `خطا در اجرای تاییدیه: ${err.message}` : `Approval error: ${err.message}`);
    } finally {
      setApproveTxMining(false);
    }
  };

  // Swap trigger handler: Execute Swap
  const triggerExecuteSwap = async (e: FormEvent) => {
    e.preventDefault();
    if (!walletConnected || !provider) {
      alert(language === "fa" ? "لطفاً ابتدا کیف پول خود را متصل کنید." : "Please connect your wallet first.");
      return;
    }
    if (swapType === "tokens_to_tokens" && (!swapTokenIn || !swapTokenOut)) {
      alert(language === "fa" ? "هر دو آدرس توکن برای سواپ الزامی هستند." : "Both token addresses are required for swap.");
      return;
    }
    if (swapType === "eth_to_tokens" && !swapTokenOut) {
      alert(language === "fa" ? "آدرس توکن خروجی الزامی است." : "Output token address is required.");
      return;
    }

    setSwapTxMining(true);
    setSwapTxHash("");
    setSwapStatusText("");

    try {
      const signer = await provider.getSigner();
      const routerContract = new ethers.Contract(
        routerAddress.trim(),
        swapType === "eth_to_tokens"
          ? ["function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"]
          : ["function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"],
        signer
      );

      const toAddress = userAddress;
      const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 mins
      const finalAmountOutMin = ethers.parseUnits(swapAmountOutMin || "0", 18);

      let tx;
      if (swapType === "eth_to_tokens") {
        const amountInWei = ethers.parseEther(swapAmountIn);
        const path = [wethAddress.trim(), swapTokenOut.trim()];
        setSwapStatusText(language === "fa" ? "در حال ارسال تراکنش سواپ اتریوم..." : "Sending ETH swap transaction...");
        tx = await routerContract.swapExactETHForTokens(
          finalAmountOutMin,
          path,
          toAddress,
          deadline,
          { value: amountInWei }
        );
      } else {
        const amountInUnits = ethers.parseUnits(swapAmountIn, 18);
        const path = [swapTokenIn.trim(), swapTokenOut.trim()];
        setSwapStatusText(language === "fa" ? "در حال ارسال تراکنش سواپ توکن به توکن..." : "Sending token to token swap transaction...");
        tx = await routerContract.swapExactTokensForTokens(
          amountInUnits,
          finalAmountOutMin,
          path,
          toAddress,
          deadline
        );
      }

      setSwapTxHash(tx.hash);
      setSwapStatusText(language === "fa" ? "تراکنش سواپ با موفقیت ارسال شد. منتظر تایید بلاکچین..." : "Swap transaction sent. Waiting for block confirmation...");
      await tx.wait();
      setSwapStatusText(language === "fa" ? "سواپ با موفقیت انجام شد!" : "Swap executed successfully!");
    } catch (err: any) {
      console.error(err);
      setSwapStatusText(language === "fa" ? `خطا در سواپ: ${err.message}` : `Swap execution error: ${err.message}`);
    } finally {
      setSwapTxMining(false);
    }
  };

  // Copy code utility
  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  // Server-side Gemini API call
  const handleAskAI = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiLoading(true);

    try {
      const response = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `User asks: "${userMsg}". Here is their configured project environment variables:
          - RPC URL: ${rpcUrl}
          - Chain ID: ${chainId}
          - Wrapped native token address (WETH): ${wethAddress}
          - Deployer Fee Setter wallet: ${feeSetter}
          - Project name: ${projectName}. 
          This is a REAL dapp. We have written UniswapV2Factory.sol and UniswapV2Router02.sol inside physical contracts/ folders.
          The user is operating real MetaMask operations on TaQoin chain ID 1827.
          Answer in Persian nicely. Guide them with EVM/Uniswap logic if they represent a beginner. Give practical code examples in Hardhat/Javascript if they ask.`,
          systemInstruction: "You are the TeQoin DEX Solid Copilot & Architect. Answer in beautiful structural Persian by default with clear Markdown code snippets. Keep it highly practical (no simulation talk)."
        })
      });
      
      const data = await response.json();
      if (data.error) {
        setChatHistory(prev => [...prev, { sender: "ai", text: `❌ متاسفانه خطایی در برقراری ارتباط با هوش مصنوعی رخ داد: ${data.error}` }]);
      } else {
        setChatHistory(prev => [...prev, { sender: "ai", text: data.text || "پاسخ خالی بازگردانده شد." }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: "ai", text: "❌ خطا در ارسال درخواست به سرور کمکی." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const setQuestionSnippet = (conceptKey: string) => {
    let question = "";
    if (conceptKey === "ethers_connect") question = "چطور در فرانت‌اند با ethers.js با متدهای swapExactETHForTokens تعامل کنم؟ نمونه کد بدهید.";
    if (conceptKey === "token_approve") question = "چرا قبل از تعامل با مسیریاب Router به تاییدیه Approve توکن نیاز داریم؟ فرمول و مثال بنویسید.";
    if (conceptKey === "deploy_hardhat") question = "راهنمای کامل دیپلوکتن صرافی در شبکه آزمایشی TaQoin با استفاده از خط فرمان هارد‌هت چیست؟";
    if (conceptKey === "verify_contract") question = "چطور می‌توانم قرارداد UniswapV2Router02 را در مرورگر بلاک تستی TaQoin تایید (Verify) کنم؟";
    
    setChatInput(question);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar Component */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        walletConnected={walletConnected}
        userAddress={userAddress}
        userBalance={userBalance}
        currentSymbol={currentSymbol}
        walletLoading={walletLoading}
        connectWallet={connectWallet}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        dexTab={dexTab}
        setDexTab={setDexTab}
      />

      {/* Main DeFi Swapper UI Block */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start items-center">
        
        <div className="w-full flex justify-center py-6">
          {dexTab === "swap" ? (
            <SwapTab
              language={language}
              currentSymbol={currentSymbol}
              explorerUrl={explorerUrl}
              walletConnected={walletConnected}
              swapType={swapType}
              setSwapType={setSwapType}
              swapAmountIn={swapAmountIn}
              setSwapAmountIn={setSwapAmountIn}
              swapAmountOutMin={swapAmountOutMin}
              setSwapAmountOutMin={setSwapAmountOutMin}
              swapTokenIn={swapTokenIn}
              setSwapTokenIn={setSwapTokenIn}
              swapTokenOut={swapTokenOut}
              setSwapTokenOut={setSwapTokenOut}
              token0Address={token0Address}
              token1Address={token1Address}
              swapTxMining={swapTxMining}
              approveTxMining={approveTxMining}
              swapTxHash={swapTxHash}
              approveTxHash={approveTxHash}
              swapStatusText={swapStatusText}
              triggerApproveForSwap={triggerApproveForSwap}
              triggerExecuteSwap={triggerExecuteSwap}
            />
          ) : (
            <LiquidityTab
              language={language}
              walletConnected={walletConnected}
              explorerUrl={explorerUrl}
              queryLoading={queryLoading}
              pairAddressResult={pairAddressResult}
              reserve0Result={reserve0Result}
              reserve1Result={reserve1Result}
              poolStatusText={poolStatusText}
              queryOnChainPair={queryOnChainPair}
              pairTokenA={pairTokenA}
              setPairTokenA={setPairTokenA}
              pairTokenB={pairTokenB}
              setPairTokenB={setPairTokenB}
              txMining={txMining}
              txHashResult={txHashResult}
              triggerCreatePairOnChain={triggerCreatePairOnChain}
            />
          )}
        </div>

        {/* Collapsible Admin Section toggleable in header */}
        {showAdmin && (
          <div className="w-full max-w-4xl transition duration-300">
            <AdminPanel
              language={language}
              rpcUrl={rpcUrl}
              setRpcUrl={setRpcUrl}
              chainId={chainId}
              setChainId={setChainId}
              wethAddress={wethAddress}
              setWethAddress={setWethAddress}
              feeSetter={feeSetter}
              setFeeSetter={setFeeSetter}
              projectName={projectName}
              setProjectName={setProjectName}
              factoryAddress={factoryAddress}
              setFactoryAddress={setFactoryAddress}
              routerAddress={routerAddress}
              setRouterAddress={setRouterAddress}
              token0Address={token0Address}
              setToken0Address={setToken0Address}
              token1Address={token1Address}
              setToken1Address={setToken1Address}
              addTaQoinNetwork={addTaQoinNetwork}
              currentSymbol={currentSymbol}
              explorerUrl={explorerUrl}
              files={files}
              selectedFileIndex={selectedFileIndex}
              setSelectedFileIndex={setSelectedFileIndex}
              copiedFileIndex={copiedFileIndex}
              handleCopyCode={handleCopyCode}
              activeFile={activeFile}
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatHistory={chatHistory}
              aiLoading={aiLoading}
              handleAskAI={handleAskAI}
              setQuestionSnippet={setQuestionSnippet}
            />
          </div>
        )}

      </main>

      {/* Persistent humble Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div>
          <span>{projectName} v1.1.0 — Connected To Chain ID {chainId} on </span>
          <a
            href={rpcUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-500 hover:underline font-bold"
          >
            {rpcUrl.replace("https://", "")}
          </a>
        </div>
      </footer>
    </div>
  );
}
