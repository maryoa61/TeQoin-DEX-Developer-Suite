/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Folder, 
  FileCode, 
  Terminal, 
  Github, 
  Cpu, 
  RefreshCw, 
  Copy, 
  Check, 
  Settings, 
  Layers, 
  TrendingUp, 
  ArrowLeftRight, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Send,
  Sparkles,
  Lock,
  Globe,
  AlertCircle,
  Wallet,
  Activity,
  ArrowUpRight,
  Download,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ethers } from "ethers";
import { getProjectFiles, ProjectFile } from "./contractsCode";

export default function App() {
  // Config state (Dynamic environment params)
  const [rpcUrl, setRpcUrl] = useState("https://rpc.teqoin.io");
  const [chainId, setChainId] = useState(420377);
  const [wethAddress, setWethAddress] = useState("0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2");
  const [feeSetter, setFeeSetter] = useState("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [projectName, setProjectName] = useState("teqoin-dex");
  
  // App navigation state
  const [activeTab, setActiveTab] = useState<"onchain" | "workspace" | "github" | "copilot">("onchain");
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
  const [factoryAddress, setFactoryAddress] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const [routerAddress, setRouterAddress] = useState("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const [token0Address, setToken0Address] = useState("0x173aEb5005CDA99fD8469fD5c6978f5339CEd8e2");
  const [token1Address, setToken1Address] = useState("0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2");
  
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
  const [swapTokenIn, setSwapTokenIn] = useState("0x173aEb5005CDA99fD8469fD5c6978f5339CEd8e2");
  const [swapTokenOut, setSwapTokenOut] = useState("0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2");
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
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Generate customized files based on user variables
  const files = getProjectFiles({ rpcUrl, chainId, wethAddress, feeSetter, projectName });
  const activeFile = files[selectedFileIndex] || files[0];

  const isL2 = chainId === 420377;
  const currentSymbol = isL2 ? "ETH" : "TEQ";
  const explorerUrl = isL2 ? "https://testnet-blockscan.teqoin.io/" : "https://explorer.teqoin.com";

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

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

      setPoolStatusText("در حال بررسی وضعیت جفت در بلاکچین تستی...");
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
      // Approve high amount
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
      
      {/* Real DEX Glow Header */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                {language === "fa" ? "درگاه توسعه صرافی TeQoin DEX" : "TeQoin DEX Live dApp Suite"}
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold">LIVE PRODUCTION</span>
            </div>
            <p className="text-xs text-slate-400">
              {language === "fa" ? "پلتفرم توسعه، پایش استخر و تعامل واقعی متامسک روی شبکه تست‌نت TaQoin" : "Real-world MetaMask interactive suite & testnet bridge"}
            </p>
          </div>
        </div>

        {/* Global Controls & Connect Status */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setLanguage(l => l === "fa" ? "en" : "fa")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 transition duration-150"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            {language === "fa" ? "Switch to English" : "تغییر زبان به فارسی"}
          </button>

          <span className="h-6 w-px bg-slate-800" />

          {/* Real Wallet Badge Indicator */}
          {walletConnected ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <div className="text-right">
                <p className="text-[10px] font-mono leading-none text-emerald-400 font-bold">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </p>
                <p className="text-[9px] font-mono text-slate-400 leading-none mt-0.5">
                  {parseFloat(userBalance).toFixed(4)} {currentSymbol}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={walletLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 font-sans shadow-lg shadow-emerald-500/10 transition-all duration-150"
            >
              <Wallet className="w-4 h-4" />
              {walletLoading ? "Connecting..." : (language === "fa" ? "اتصال کیف پول متامسک" : "Connect MetaMask Wallet")}
            </button>
          )}
        </div>
      </header>

      {/* Main Tab Bar Navigation */}
      <div className="bg-slate-900/50 border-b border-slate-900 px-6 py-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("onchain")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "onchain" 
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/20" 
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {language === "fa" ? "تعامل مستقیم و آزمایش استخر واقعی شبکه تستی" : "On-chain Testnet Panel & DEX Interactions"}
        </button>

        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "workspace" 
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/20" 
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          {language === "fa" ? "فایل‌های قرارداد و پیکربندی پروژه" : "Solidity Codes & Real Configs"}
        </button>

        <button
          onClick={() => setActiveTab("github")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "github" 
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/20" 
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          {language === "fa" ? "مراحل نهایی و پایپلاین گیت‌هاب اکشنز" : "GitHub CI/CD Deployment Workflow"}
        </button>

        <button
          onClick={() => setActiveTab("copilot")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "copilot" 
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/20" 
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {language === "fa" ? "پشتیبان هوشمند صرافی صرافی" : "DEX Solidity Copilot"}
        </button>
      </div>

      {/* Main Studio layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Body Panel (12 columns) */}
        <div className="lg:col-span-12">
          
          <AnimatePresence mode="wait">
            
            {/* 1. ON-CHAIN TESTNET LIVE PANEL */}
            {activeTab === "onchain" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* MetaMask Setup Card & RPC Injection (Left Col) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Network Setup Widget */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-slate-100">
                        {language === "fa" ? "تنظیم خودکار متامسک" : "MetaMask Network Automations"}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa" 
                        ? "دکمه زیر را فشار دهید تا شبکه تستی زنجیره و تست‌نت TaQoin به طور اتوماتیک وارد کیف پول مرورگر شما شود تا با DEX تعامل کنید."
                        : "Click to automatically add the custom TaQoin network specifications into your default wallet system."}
                    </p>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 font-mono text-[10px] space-y-1 text-slate-400">
                      <div><span className="text-slate-500">RPC Gateway:</span> {rpcUrl}</div>
                      <div><span className="text-slate-500">Network ID:</span> {chainId}</div>
                      <div><span className="text-slate-500">Currency Symbol:</span> {currentSymbol}</div>
                      <div><span className="text-slate-500">Explorer Url:</span> {explorerUrl}</div>
                    </div>

                    <button
                      onClick={addTaQoinNetwork}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      {language === "fa" ? "افزودن شبکه TaQoin به متامسک" : "Connect & Add TaQoin to MetaMask"}
                    </button>
                  </div>

                  {/* Environment Config params */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                        <Settings className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-slate-100">
                        {language === "fa" ? "تنظیمات آدرس زنجیره" : "Interactions Setup"}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-400">
                      {language === "fa"
                        ? "آدرس قراردادهایی که دیپلوی شده‌اند را اینجا وارد کرده تا در کارت‌های آزمایش استخر مورد استفاده قرار گیرند:" 
                        : "Adjust target core DEX address variables to interact live with the contracts:"}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono mb-1">FACTORY ADDRESS:</label>
                        <input 
                          type="text" 
                          value={factoryAddress} 
                          onChange={(e) => setFactoryAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono mb-1">ROUTER02 ADDRESS:</label>
                        <input 
                          type="text" 
                          value={routerAddress} 
                          onChange={(e) => setRouterAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono mb-1">TOKEN 0 REPRESENTATIVE ({currentSymbol}):</label>
                        <input 
                          type="text" 
                          value={token0Address} 
                          onChange={(e) => setToken0Address(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-mono mb-1">TOKEN 1 REPRESENTATIVE (USDT):</label>
                        <input 
                          type="text" 
                          value={token1Address} 
                          onChange={(e) => setToken1Address(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Main Interaction Cards (Right Col) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                  {/* Real Pool Reserves checking card */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-slate-100">
                          {language === "fa" ? "مرحله ۱: استعلام مستقیم ذخایر استخر از شبکه آزمایشی" : "Check Live Liquidity Pool Reserves on Chain"}
                        </h2>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        READ-ONLY CALL
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "این ماژول جفت استخر (Pair Address) و ذخایر ارزها را به صورت کامپایل زنده از RPC رسمی شبکه تستی TaQoin در همان لحظه می‌خواند:"
                        : "Query any Uniswap v2 pair address and live reserves balance direct from TeQoin network smart contract."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-500 font-mono block">LIVE LIQUIDITY POOL ADDRESS:</span>
                        {pairAddressResult ? (
                          <span className={`text-xs ml-1 font-mono tracking-tight text-emerald-400`}>
                            {pairAddressResult}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">—</span>
                        )}
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono block">RESERVE 0:</span>
                          <span className="text-sm font-mono font-bold text-slate-300">
                            {reserve0Result ? parseFloat(reserve0Result).toFixed(4) : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono block">RESERVE 1:</span>
                          <span className="text-sm font-mono font-bold text-slate-300">
                            {reserve1Result ? parseFloat(reserve1Result).toFixed(4) : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {poolStatusText && (
                      <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900 text-xs text-emerald-300 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{poolStatusText}</span>
                      </div>
                    )}

                    <button
                      onClick={queryOnChainPair}
                      disabled={queryLoading}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-slate-950 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {queryLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowLeftRight className="w-4 h-4" />
                      )}
                      {language === "fa" ? "فراخوانی وضعیت جفت لایه نقدینگی" : "Fetch Reserves from TaQoin Network"}
                    </button>
                  </div>

                  {/* Write Contract creating LP pair via MetaMask */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-slate-100">
                          {language === "fa" ? "مرحله ۲: ایجاد استخر جدید توسط کیف پول متامسک شما" : "Create New Liquidity Pool (Pair)"}
                        </h2>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-slate-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        WRITE CONTRACT CALL
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "با اتصال متامسک می‌توانید با کلیک روی تراکنش، متد createPair را مستقیماً روی قرارداد کارخانه (UniswapV2Factory) در شبکه آزمایشی TaQoin اجرا کنید و استخر جدید بسازید."
                        : "Connect your MetaMask, provide two token addresses, and call the Factory createPair function on the real network."}
                    </p>

                    <form onSubmit={triggerCreatePairOnChain} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono mb-1">TOKEN A ADDRESS:</label>
                          <input 
                            type="text" 
                            placeholder="0x..." 
                            value={pairTokenA}
                            onChange={(e) => setPairTokenA(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono mb-1">TOKEN B ADDRESS:</label>
                          <input 
                            type="text" 
                            placeholder="0x..."
                            value={pairTokenB}
                            onChange={(e) => setPairTokenB(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-855 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                            required
                          />
                        </div>
                      </div>

                      {txHashResult && (
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-900/40 text-xs flex flex-col gap-1 text-indigo-300">
                          <span className="font-bold text-[10px] text-slate-500 font-mono">TX BROADCAST SUCCESS:</span>
                          <a 
                            href={`${explorerUrl}tx/${txHashResult}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="underline font-mono text-[11px] truncate flex items-center gap-1 hover:text-indigo-200"
                          >
                            <span>{txHashResult}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={txMining || !walletConnected}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-slate-100 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
                      >
                        {txMining ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Wallet className="w-4 h-4" />
                        )}
                        {!walletConnected 
                          ? (language === "fa" ? "ابتدا متامسک را وصل کنید" : "Connect wallet first") 
                          : (language === "fa" ? "دیپلوی و ایجاد استخر جفت در بلاکچین" : "Broadcast createPair Transaction")}
                      </button>
                    </form>
                  </div>

                  {/* Write Contract: Swap via Router02 */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <ArrowLeftRight className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-slate-100">
                          {language === "fa" ? "مرحله ۳: انجام سواپ واقعی رمز ارز از طریق Router02" : "Swap Tokens/ETH via Router02"}
                        </h2>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        ROUTER02 WRITE CALL
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "با استفاده از کیف پول متصل خود مستقیماً با متدهای صرافی UniswapV2Router02 تعامل کنید. شما می‌توانید ریال دیجیتال/اتریوم تستی را با توکن ERC20 یا دو توکن ERC20 را با یکدیگر مبادله کنید:"
                        : "Interact with UniswapV2Router02 swap mechanisms. Execute instant swapExactETHForTokens or swapExactTokensForTokens directly on TaQoin network."}
                    </p>

                    {/* Swap Type Selector Tabs */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
                      <button
                        onClick={() => {
                          setSwapType("eth_to_tokens");
                          setSwapStatusText("");
                        }}
                        className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition duration-150 ${
                          swapType === "eth_to_tokens"
                            ? "bg-slate-800 text-emerald-400 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        type="button"
                      >
                        {language === "fa" ? `سواپ کوین بومی (${currentSymbol}) به توکن` : `Swap Native ${currentSymbol} for Tokens`}
                      </button>
                      <button
                        onClick={() => {
                          setSwapType("tokens_to_tokens");
                          setSwapStatusText("");
                        }}
                        className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition duration-150 ${
                          swapType === "tokens_to_tokens"
                            ? "bg-slate-800 text-emerald-400 shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        type="button"
                      >
                        {language === "fa" ? "سواپ توکن با توکن (ERC20)" : "Swap ERC20 for ERC20"}
                      </button>
                    </div>

                    <form onSubmit={triggerExecuteSwap} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono mb-1">
                            {language === "fa" ? "مقدار ورودی برای پرداخت:" : "AMOUNT IN (TO PAY):"}
                          </label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={swapAmountIn}
                              onChange={(e) => setSwapAmountIn(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-emerald-500 outline-none pr-12"
                              required
                            />
                            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-500 font-mono">
                              {swapType === "eth_to_tokens" ? `${currentSymbol} (WETH)` : "TOKEN IN"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono mb-1">
                            {language === "fa" ? "حداقل مقدار خروجی یا لغزش:" : "MINIMUM OUT (SLIPPAGE):"}
                          </label>
                          <input 
                            type="text" 
                            value={swapAmountOutMin}
                            onChange={(e) => setSwapAmountOutMin(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-855 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                            required
                          />
                        </div>
                      </div>

                      {swapType === "tokens_to_tokens" ? (
                        <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-850 font-sans">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] text-slate-500 font-mono">TOKEN IN (ERC20) ADDRESS:</label>
                              <button
                                type="button"
                                onClick={() => setSwapTokenIn(token0Address)}
                                className="text-[9px] text-emerald-400 hover:underline"
                              >
                                {language === "fa" ? "قراردادن آدرس توکن آزمایشی ۰" : "Use Token 0 Representative"}
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={swapTokenIn}
                              onChange={(e) => setSwapTokenIn(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                              required
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] text-slate-500 font-mono">TOKEN OUT (ERC20) ADDRESS:</label>
                              <button
                                type="button"
                                onClick={() => setSwapTokenOut(token1Address)}
                                className="text-[9px] text-emerald-400 hover:underline"
                              >
                                {language === "fa" ? "قراردادن آدرس توکن آزمایشی ۱" : "Use Token 1 Representative"}
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={swapTokenOut}
                              onChange={(e) => setSwapTokenOut(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                              required
                            />
                          </div>

                          <div className="bg-amber-500/5 text-amber-400 text-[11px] p-3 rounded-lg border border-amber-500/10 leading-normal flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>
                              {language === "fa"
                                ? "برای سواپ توکن به توکن ابتدا باید با زدن دکمه تایید پرداخت (Approve)، به روتر اجازه انتقال توکن را صادر کنید تا تراکنش سواپ با موفقیت انجام شود."
                                : "Swapping ERC20 tokens directly requires you to broadcast an Approve transaction first so the router contract can spend them."}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-850 space-y-3 font-sans">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] text-slate-500 font-mono">SWAP OUTPUT TARGET TOKEN ADDRESS:</label>
                              <button
                                type="button"
                                onClick={() => setSwapTokenOut(token1Address)}
                                className="text-[9px] text-emerald-400 hover:underline"
                              >
                                {language === "fa" ? "قراردادن آدرس توکن آزمایشی ۱" : "Use Token 1 Representative"}
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={swapTokenOut}
                              onChange={(e) => setSwapTokenOut(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Status display */}
                      {swapStatusText && (
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-emerald-300 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{swapStatusText}</span>
                        </div>
                      )}

                      {/* Transactions hashes output */}
                      {(approveTxHash || swapTxHash) && (
                        <div className="space-y-2">
                          {approveTxHash && (
                            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-950/40 text-xs flex flex-col gap-0.5 text-emerald-300">
                              <span className="font-bold text-[10px] text-slate-500 font-mono">APPROVE TX HASH:</span>
                              <a 
                                href={`${explorerUrl}tx/${approveTxHash}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="underline font-mono text-[11px] truncate flex items-center gap-1 hover:text-emerald-200"
                              >
                                <span>{approveTxHash}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}

                          {swapTxHash && (
                            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-950/40 text-xs flex flex-col gap-0.5 text-emerald-300">
                              <span className="font-bold text-[10px] text-slate-500 font-mono">SWAP TX HASH:</span>
                              <a 
                                href={`${explorerUrl}tx/${swapTxHash}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="underline font-mono text-[11px] truncate flex items-center gap-1 hover:text-emerald-200"
                              >
                                <span>{swapTxHash}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {swapType === "tokens_to_tokens" && (
                          <button
                            type="button"
                            onClick={triggerApproveForSwap}
                            disabled={approveTxMining || !walletConnected}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            {approveTxMining ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            {language === "fa" ? "۱. تایید پرداخت توکن (Approve)" : "1. Approve Router Spender"}
                          </button>
                        )}

                        <button
                          type="submit"
                          disabled={swapTxMining || !walletConnected}
                          className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                            swapType === "tokens_to_tokens"
                              ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-slate-950 shadow-emerald-500/10"
                              : "col-span-1 md:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-slate-950 shadow-emerald-500/10"
                          }`}
                        >
                          {swapTxMining ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4" />
                          )}
                          {!walletConnected 
                            ? (language === "fa" ? "ابتدا متامسک را وصل کنید" : "Connect wallet first") 
                            : swapType === "tokens_to_tokens"
                              ? (language === "fa" ? "۲. انجام نهایی مبادله (Swap)" : "2. Broadcast Swap")
                              : (language === "fa" ? "دیپلوی تراکنش مبادله (Swap)" : "Broadcast Swap Transaction")}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Interactive Swap Simulation Info card */}
                  <div className="bg-slate-900/60 border border-slate-850/60 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-slate-200">
                        {language === "fa" ? "محیط برنامه متصل به شبکه زنده تستی" : "Production dApp Layer is Active"}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "این برنامه به طور کامل قابلیت ارتباط با شبکه آزمایشی TaQoin را داراست و جفت قراردادهای واقعی کارخانه و روتری که مستقیماً در پوشه contracts/ پروژه شما مستقر شده‌اند را هدف قرار می‌دهد."
                        : "This platform is fully wired to integrate with MetaMask and execute actual state changes over the public node."}
                    </p>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. SOLIDITY CONTRACT INTERFACE (WORKSPACE) */}
            {activeTab === "workspace" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* File List Tree Sidebar (Right 3 cols) */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-emerald-500" />
                      CONTRACTS WORKSPACE
                    </h3>

                    {files.map((file, idx) => (
                      <button
                        key={file.name}
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition duration-150 ${
                          selectedFileIndex === idx 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "text-slate-400 hover:bg-slate-950 hover:text-slate-200 border border-transparent"
                        }`}
                      >
                        <FileCode className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selectedFileIndex === idx ? "text-emerald-400" : "text-slate-500"}`} />
                        <div className="truncate">
                          <p className="font-mono font-bold leading-none truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 truncate leading-none mt-1 font-sans">
                            {language === "fa" ? file.descriptionFa : file.descriptionEn}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900 border border-slate-855 rounded-2xl p-4 text-xs flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">PROJECT SETTINGS</span>
                    
                    <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Network ID:</span>
                        <span className="text-emerald-400">{chainId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Compiler version:</span>
                        <span className="text-slate-300 font-mono">0.5.16 / 0.6.6</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Optimization:</span>
                        <span className="text-slate-300">999999 runs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Code Viewer and variables (Left 9 cols) */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                  
                  {/* Variables Adjustment */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1">TEQOIN RPC GATEWAY:</label>
                      <input 
                        type="text" 
                        value={rpcUrl} 
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1">WRAPPED WRAP (WETH):</label>
                      <input 
                        type="text" 
                        value={wethAddress} 
                        onChange={(e) => setWethAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1">FEE SETTER (DEPLOYER):</label>
                      <input 
                        type="text" 
                        value={feeSetter} 
                        onChange={(e) => setFeeSetter(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col">
                    <div className="bg-slate-950 border-b border-slate-900 px-5 py-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono text-slate-300 font-bold">{activeFile.path}</span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(activeFile.content, selectedFileIndex)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-sans transition-all"
                      >
                        {copiedFileIndex === selectedFileIndex ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-400 text-[11px] font-bold">کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">کپی فایل</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-5 font-mono text-xs overflow-auto max-h-[500px] leading-relaxed bg-slate-950 text-slate-300 select-all whitespace-pre">
                      {activeFile.content}
                    </div>

                    <div className="p-4 bg-slate-900/50 border-t border-slate-900 text-xs text-slate-400 flex items-center justify-between gap-4">
                      <span>{language === "fa" ? "سورس‌کد فوق مستقیماً در دایرکتوری شما ذخیره شده است." : "The above source file is physically committed in your code workspace."}</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 3. GITHUB AUTOMATION DEPLOY WORKFLOW */}
            {activeTab === "github" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                
                {/* CI/CD Instructions (Left 7 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2.5">
                      <Github className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-lg font-bold text-slate-100">
                        {language === "fa" ? "راهنمای راه‌اندازی و بیلد گیت‌هاب (Github Action)" : "GitHub Automation & CI/CD Pipeline"}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "قراردادهای ایجاد شده با ساخت و فعالسازی GitHub Secrets به صورت تمام اتوماتیک با هر push روی شبکه آزمایشی دیپلوی می‌شوند. مراحل ساده زیر را به ترتیب در گیت‌هاب خود پیاده‌سازی کنید:"
                        : "Our custom Solidity codebase includes an automated continuous deployment pipeline. Follow these instructions to trigger automatic testnet deployment inside GitHub:"}
                    </p>

                    <div className="space-y-4 my-2">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-emerald-400 font-bold flex-shrink-0">1</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{language === "fa" ? "ورود به مخزن گیت‌هاب پروژه" : "Navigate to GitHub Repository"}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{language === "fa" ? "مخزن گیت‌هاب را باز کرده و به زبانه Settings بروید." : "Go to your exported GitHub project, click on 'Settings' tab."}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-emerald-400 font-bold flex-shrink-0">2</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{language === "fa" ? "ایجاد کلیدهای محرمانه (Repository Secrets)" : "Add Action Secrets"}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                            {language === "fa" 
                              ? "در ستون چپ به بخش Secrets and variables و سپس Actions وارد شده و دو سکرت زیر را تعریف کنید:" 
                              : "Click 'Secrets and variables' -> 'Actions' -> 'New repository secret'. Define these keys:"}
                          </p>

                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-855 font-mono text-[11px] text-slate-400 mt-2 space-y-1">
                            <div>• <span className="text-emerald-400 font-bold">PRIVATE_KEY</span>: <span className="text-slate-500">{language === "fa" ? "کلید خصوصی ولت دیپلوی‌کننده دارای موجودی کوین بومی" : "Your deployer private key with native coin balance"}</span></div>
                            <div>• <span className="text-emerald-400 font-bold">TEQOIN_RPC_URL</span>: <span className="text-slate-500">{rpcUrl}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-emerald-400 font-bold flex-shrink-0">3</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{language === "fa" ? "اجرای خودکار و دیپلوی زنده" : "Push to Deploy"}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{language === "fa" ? "با کوچک‌ترین تغییر یا Push روی شاخه اصلی (main)، گیت‌هاب بصورت کاملا خودکار قراردادها را کامپایل کرده و اطلاعات ورودی را دیپلوی و تراکنش‌های زنده را روی بلاکچین TaQoin ثبت می‌کند." : "Push any commit or changes to main/master, and GitHub Actions automatically compiles and deploys Uniswap V2 contracts live on TaQoin!"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Workflow Code Review (Right 4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider">WORKFLOW MANIFOLD</span>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "fa"
                        ? "کلیدهای دیپلوی خودکار در فایل .github/workflows/deploy.yml تعریف شده‌اند که می‌توانید سورس آن را مشاهده کنید."
                        : "Review Github Actions descriptor setup in the actual project directory workflow config."}
                    </p>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-400 leading-snug overflow-auto max-h-[220px]">
                      {files[3]?.content}
                    </div>

                    <a 
                      href="https://github.com/features/actions" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === "fa" ? "مشاهده مستندات گیت‌هاب اکشنز" : "GitHub Actions website"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </motion.div>
            )}

            {/* 4. SOLIDITY ASSISTANT / COPILOT */}
            {activeTab === "copilot" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                
                {/* FAQ Quick Buttons (Left 4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-slate-200">
                        {language === "fa" ? "سؤالات متداول توسعه سالیدیتی" : "Solidity DEX Quick Reference"}
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-1">
                      {language === "fa"
                        ? "برای دریافت توضیحات تخصصی، روی موضوعات زیر کلیک کرده و سپس دکمه ارسال به هوش مصنوعی را بزنید:"
                        : "Click any prompt topic to load it into the main Solidity AI consult terminal below:"}
                    </p>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setQuestionSnippet("ethers_connect")}
                        className="p-2.5 rounded-lg bg-slate-950 text-left text-[11px] hover:bg-slate-800 transition duration-150 border border-slate-850 hover:border-emerald-500/20 text-slate-300"
                      >
                        ⚡ {language === "fa" ? "کال بیک و اتصال به ethers.js" : "Hooking client state with Ethers.js"}
                      </button>

                      <button
                        onClick={() => setQuestionSnippet("token_approve")}
                        className="p-2.5 rounded-lg bg-slate-950 text-left text-[11px] hover:bg-slate-800 transition duration-150 border border-slate-850 hover:border-emerald-500/20 text-slate-300"
                      >
                        ⚡ {language === "fa" ? "تایید صلاحیت Approve توکن" : "Understanding Token Approvals"}
                      </button>

                      <button
                        onClick={() => setQuestionSnippet("deploy_hardhat")}
                        className="p-2.5 rounded-lg bg-slate-950 text-left text-[11px] hover:bg-slate-800 transition duration-150 border border-slate-850 hover:border-emerald-500/20 text-slate-300"
                      >
                        ⚡ {language === "fa" ? "اجرای هارد‌هت در محیط خط فرمان" : "Hardhat compile & runtime guide"}
                      </button>

                      <button
                        onClick={() => setQuestionSnippet("verify_contract")}
                        className="p-2.5 rounded-lg bg-slate-950 text-left text-[11px] hover:bg-slate-800 transition duration-150 border border-slate-855 hover:border-emerald-500/20 text-slate-300"
                      >
                        ⚡ {language === "fa" ? "احراز اصالت در مرورگر بلاک" : "EVM block explorer verification"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Chat Window (Right 8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col h-[520px] justify-between">
                    
                    {/* Header */}
                    <div className="border-b border-slate-850 pb-3 mb-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                        <h2 className="text-sm font-bold text-slate-200">
                          {language === "fa" ? "دستیار و بهینه‌ساز تخصصی قراردادهای هوشمند TeQoin" : "AI Solidity Copilot Panel"}
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">POWERED BY GEMINI 3.5</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-auto space-y-4 pr-1 scrollbar-thin">
                      {chatHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-emerald-600 text-slate-950 font-medium rounded-tr-none"
                                : "bg-slate-950 text-slate-200 border border-slate-855 rounded-tl-none whitespace-pre-wrap"
                            }`}
                          >
                            <p className="font-sans">{msg.text}</p>
                          </div>
                        </div>
                      ))}

                      {aiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-slate-950 border border-slate-850 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </span>
                            <span>{language === "fa" ? "در حال پردازش منطق سالیدیتی..." : "Analyzing Solidity semantics..."}</span>
                          </div>
                        </div>
                      )}

                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Form */}
                    <form onSubmit={handleAskAI} className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={language === "fa" ? "سوال خود را بپرسید... (مثال: چطور Swap انجام دهم؟)" : "Ask Copilot... (e.g. explain getAmountOut logic)"}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:border-emerald-500 outline-none font-sans"
                        required
                      />

                      <button
                        type="submit"
                        disabled={aiLoading}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
          
        </div>
        
      </main>

      {/* Footer Info Lines */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div>
          <span>{projectName} v1.0.0 — Connected To Chain ID {chainId} on </span>
          <a href={rpcUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">{rpcUrl.replace("https://", "")}</a>
        </div>
      </footer>
    </div>
  );
}

// Simple local SVGs
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
