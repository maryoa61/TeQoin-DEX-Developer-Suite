/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
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
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getProjectFiles, ProjectFile } from "./contractsCode";

export default function App() {
  // Config state
  const [rpcUrl, setRpcUrl] = useState("https://rpc.teqoin.com");
  const [chainId, setChainId] = useState(1827);
  const [wethAddress, setWethAddress] = useState("0xC02aaA39b223FE8D0A0e5C4F27ead9083C756Cc2");
  const [feeSetter, setFeeSetter] = useState("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [projectName, setProjectName] = useState("teqoin-dex");
  
  // App state
  const [activeTab, setActiveTab] = useState<"workspace" | "deployer" | "simulator" | "github" | "assistant">("workspace");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState<"fa" | "en">("fa");

  // Terminal state
  const [compiling, setCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [simulatedFactoryAddress, setSimulatedFactoryAddress] = useState("");
  const [simulatedRouterAddress, setSimulatedRouterAddress] = useState("");

  // DEX state
  const [tokenA, setTokenA] = useState("TEQ");
  const [tokenB, setTokenB] = useState("USDT");
  const [reserveA, setReserveA] = useState<number>(10000);
  const [reserveB, setReserveB] = useState<number>(30000);
  const [addQtyA, setAddQtyA] = useState<string>("100");
  const [addQtyB, setAddQtyB] = useState<string>("300");
  const [swapInput, setSwapInput] = useState<string>("10");
  const [swapDirection, setSwapDirection] = useState<"AtoB" | "BtoA">("AtoB");

  // AI Assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { 
      sender: "ai", 
      text: "سلام! من دستیار هوشمندِ همیارِ سالیدیتی و اتوماسیون TeQoin هستم. چطور می‌توانم در نوشتن، فهمیدن یا آزمایش قراردادهای Uniswap V2 به شما کمک کنم؟" 
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Generate customized files based on user variables
  const files = getProjectFiles({ rpcUrl, chainId, wethAddress, feeSetter, projectName });
  const activeFile = files[selectedFileIndex] || files[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  // Copy code utility
  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  // Run mock hardhat compiler sequence
  const startCompileSimulation = () => {
    if (compiling) return;
    setCompiling(true);
    setCompiled(false);
    setTerminalLogs([]);
    
    const logs = [
      "▶ Initializing Hardhat project compiler engine...",
      `⚡ Checking package dependencies in ${projectName} package.json...`,
      "✔ Found '@nomicfoundation/hardhat-toolbox' v2.0.2",
      "✔ Found 'hardhat' v2.14.0",
      "💡 Solidity compiler config matched from hardhat.config.js:",
      "   • Compiling with solidity 0.5.16 (Factory & Pair code)",
      "   • Compiling with solidity 0.6.6 (Router02 implementation)",
      "🔨 Generating contract build artifacts...",
      "⏳ Compiling 6 source files into 12 ABI descriptors...",
      "✔ SafeMath.sol compiled successfully.",
      "✔ UniswapV2ERC20.sol compiled successfully.",
      "✔ UniswapV2Pair.sol compiled successfully.",
      "✔ UniswapV2Factory.sol compiled successfully.",
      "✔ SafeMathRouter.sol compiled successfully.",
      "✔ UniswapV2Router02.sol compiled successfully.",
      "✨ Compiled 6 contracts under 2 compiler configurations with 999999 optimizer runs.",
      "📁 Created build metadata under artifacts/contracts/**/*.json",
      "✅ PROCESS SUCCESS: Contract Compilation completed. Zero errors."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setCompiling(false);
        setCompiled(true);
      }
    }, 400);
  };

  // Run mock hardhat deployment sequence
  const startDeploySimulation = () => {
    if (deploying || !compiled) return;
    setDeploying(true);
    setDeployed(false);

    const deployLogs = [
      "▶ launching scripts/deploy.js to network: 'teqoin' via hardhat runner...",
      `🌐 Connecting to TeQoin network node [RPC: ${rpcUrl}]...`,
      `📡 Connected! Network Chain Id: ${chainId}`,
      `🔑 Loaded deployer key. Account: ${feeSetter}`,
      "💰 Querying deployer balance... Balance: 852.1904 TEQ",
      "-------------------------------------------------------",
      `🚀 Step 1/3: Deploying UniswapV2Factory(feeToSetter: "${feeSetter}")...`,
      "⏳ Sending transaction. Gas estimated: 4,862,109 wei...",
      "🧾 Tx broadcasted successfully.",
      "💎 Contract deployed. Mines pending at Block #401928",
      "✔ SUCCESS: UniswapV2Factory deployed!",
      "   • Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "   • Tx Hash: 0xa9f8e4a9e211da32947a16f2c0bf7a7238a2e7c41bf6353d71ff02a921d7b1aa",
      "-------------------------------------------------------",
      `🚀 Step 2/3: Checking Wrapped native currency bridge...`,
      `📝 Target WETH Token Address assigned: ${wethAddress}`,
      "-------------------------------------------------------",
      `🚀 Step 3/3: Deploying UniswapV2Router02(factory: 0x5FbD..., weth: ${wethAddress.slice(0, 10)}...)...`,
      "⏳ Estimating route gas limits... Gas limit set to 6,104,821 wei.",
      "🧾 Tx broadcasted.",
      "💎 Router Mines pending at Block #401929",
      "✔ SUCCESS: UniswapV2Router02 deployed!",
      "   • Contract Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "   • Tx Hash: 0xbc7df35d18d4073bd311ebc4be3e9d8e7e1f487e8bf63ad1e4f489f0291ae842",
      "=======================================================",
      "🎉 DEPLOYMENT FINISHED SUCCESSFULLY!",
      "  ✔ UniswapV2Factory -> 0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "  ✔ UniswapV2Router02 -> 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "======================================================="
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < deployLogs.length) {
        setTerminalLogs(prev => [...prev, deployLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setDeploying(false);
        setDeployed(true);
        setSimulatedFactoryAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3");
        setSimulatedRouterAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
      }
    }, 450);
  };

  // Add simulated liquidity pool ratio calculation
  const handleAddLiquiditySim = () => {
    const qtyA = parseFloat(addQtyA);
    const qtyB = parseFloat(addQtyB);
    if (isNaN(qtyA) || isNaN(qtyB) || qtyA <= 0 || qtyB <= 0) return;
    setReserveA(prev => prev + qtyA);
    setReserveB(prev => prev + qtyB);
    setAddQtyA("");
    setAddQtyB("");
  };

  // Uniswap V2 exact amount output pricing math:
  // y_out = (y * dy * 0.997) / (x + dy * 0.997)
  const calculateSwapOutputs = () => {
    const amountVal = parseFloat(swapInput);
    if (isNaN(amountVal) || amountVal <= 0) return { output: 0, priceImpact: 0, slippage: 0 };

    const x = swapDirection === "AtoB" ? reserveA : reserveB;
    const y = swapDirection === "AtoB" ? reserveB : reserveA;

    // standard price before swap
    const constantProduct = x * y;
    const idealPrice = y / x;

    // Uniswap swap constant fee formula
    const amountInWithFee = amountVal * 997; // 0.3% fee
    const numerator = amountInWithFee * y;
    const denominator = (x * 1000) + amountInWithFee;
    const amountOut = numerator / denominator;

    // Price slippage and impact
    const executionPrice = amountOut / amountVal;
    const priceImpact = ((idealPrice - executionPrice) / idealPrice) * 100;
    const slippage = Math.min(99.9, Math.max(0.1, priceImpact * 1.5));

    return {
      output: isNaN(amountOut) ? 0 : amountOut,
      priceImpact: isNaN(priceImpact) ? 0 : Math.max(0, priceImpact),
      slippage: isNaN(slippage) ? 0 : slippage
    };
  };

  const { output: swapOutput, priceImpact, slippage } = calculateSwapOutputs();

  const handleExecuteSwapSim = () => {
    const qtyIn = parseFloat(swapInput);
    if (isNaN(qtyIn) || qtyIn <= 0) return;

    if (swapDirection === "AtoB") {
      if (qtyIn >= reserveA) return;
      setReserveA(prev => prev + qtyIn);
      setReserveB(prev => prev - swapOutput);
    } else {
      if (qtyIn >= reserveB) return;
      setReserveB(prev => prev + qtyIn);
      setReserveA(prev => prev - swapOutput);
    }
    setSwapInput("");
  };

  // Reset liquidity simulation pools
  const resetPools = () => {
    setReserveA(10000);
    setReserveB(30000);
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
          Answer in Persian nicely, guide them with EVM/Uniswap logic if they represent a beginner.`,
          systemInstruction: "You are the TeQoin Developer Assistant, a world-class smart contract audits advisor. Answer in beautiful structural Persian by default with clear Markdown code snippets where necessary."
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

  const explainGeneralConcept = (conceptKey: string) => {
    let question = "";
    if (conceptKey === "what_is_v2") question = "تبیین کامل Uniswap V2 و فرمول ثابت K برای مبتدی؛";
    if (conceptKey === "how_factory_works") question = "نحوه کارکرد کارخانه Factory و چگونگی ایجاد Pair کد حش در سالیدیتی؛";
    if (conceptKey === "deploy_issues") question = "مشکلات متداول دیپلوی قراردادهای Uniswap V2 در EVM مانند gas limit و رفع ارورها؛";
    if (conceptKey === "git_secrets") question = "آموزش گام به گام تنظیم کردن Private Key در GitHub Secrets برای مبتدیان؛";
    
    setChatInput(question);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Dynamic Glow Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-emerald-400">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-200">
              {language === "fa" ? "میزکار بلاکچین TeQoin DEX" : "TeQoin DEX Developer Suite"}
            </h1>
            <p className="text-xs text-slate-400">
              {language === "fa" ? "سامانه راهنمای توسعه، شبیه‌سازی و اتوماسیون Uniswap V2" : "Solid templates, testbeds, and GitHub automation guides"}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button 
            type="button"
            onClick={() => setLanguage(l => l === "fa" ? "en" : "fa")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 rounded-lg border border-slate-850 hover:bg-slate-800 transition duration-150"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            {language === "fa" ? "Switch to English" : "تغییر زبان به فارسی"}
          </button>

          <span className="h-6 w-px bg-slate-800" />

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-900">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">TeQoin RPC:</span>
              <span className="text-emerald-400 font-bold">{chainId}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panel layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8-cols): Interactive Studio Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Environment variables settings block */}
          <section className="bg-slate-900/40 rounded-xl border border-slate-900 p-5 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                {language === "fa" ? "پیکربندی هوشمند و تولید پویای کد" : "DEX Environment Variable Injection"}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="project-name-input">
                  {language === "fa" ? "نام پروژه هارد‌هت" : "Hardhat Project Name"}
                </label>
                <input 
                  id="project-name-input"
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="rpc-url-input">
                  {language === "fa" ? "آدرس RPC شبکه TeQoin" : "TeQoin Network RPC URL"}
                </label>
                <input 
                  id="rpc-url-input"
                  type="text" 
                  value={rpcUrl}
                  onChange={(e) => setRpcUrl(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="chain-id-input">
                  {language === "fa" ? "شناسه زنجیره (Chain ID)" : "TeQoin Chain ID"}
                </label>
                <input 
                  id="chain-id-input"
                  type="number" 
                  value={chainId}
                  onChange={(e) => setChainId(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="weth-address-input">
                  {language === "fa" ? "آدرس WETH زنجیره TeQoin" : "WETH / WRAPPED Token Address"}
                </label>
                <input 
                  id="weth-address-input"
                  type="text" 
                  value={wethAddress}
                  onChange={(e) => setWethAddress(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="fee-setter-input">
                  {language === "fa" ? "آدرس کیف پول سازنده (Fee Setter)" : "Fee Setter / Creator Wallet"}
                </label>
                <input 
                  id="fee-setter-input"
                  type="text" 
                  value={feeSetter}
                  onChange={(e) => setFeeSetter(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            
            <p className="mt-3 text-2xs text-slate-500 italic">
              {language === "fa" 
                ? "💡 تغییر هر کدام از مقادیر بالا بلافاصله کل پروژه‌های سالیدیتی، کانفیگ هارد‌هت و اسکریپت‌های دیپلوی زیر را به‌روزرسانی می‌کند."
                : "💡 Any change in parameters directly updates configs, Solid templates and GitHub Actions deploy.yml instantly."
              }
            </p>
          </section>

          {/* Navigation tabs */}
          <div className="bg-slate-950/20 p-1 flex bg-slate-900 border border-slate-850/60 rounded-xl">
            <button 
              type="button"
              onClick={() => setActiveTab("workspace")}
              className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-xs font-medium rounded-lg transition duration-150 ${activeTab === "workspace" ? "bg-slate-800 text-emerald-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              <Folder className="w-4 h-4" />
              {language === "fa" ? "میزکار پروژه" : "File Explorer"}
            </button>
            
            <button 
              type="button"
              onClick={() => setActiveTab("deployer")}
              className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-xs font-medium rounded-lg transition duration-150 ${activeTab === "deployer" ? "bg-slate-800 text-emerald-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              <Terminal className="w-4 h-4" />
              {language === "fa" ? "شبیه‌ساز دیپلوی" : "Deploy Simulation"}
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab("github")}
              className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-xs font-medium rounded-lg transition duration-150 ${activeTab === "github" ? "bg-slate-800 text-emerald-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              <Github className="w-4 h-4" />
              {language === "fa" ? "فرآیند گیت هاب اکشنز" : "GitHub Actions Info"}
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab("simulator")}
              className={`flex-1 flex justify-center items-center gap-1.5 py-3 text-xs font-medium rounded-lg transition duration-150 ${activeTab === "simulator" ? "bg-slate-800 text-emerald-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              {language === "fa" ? "تست مبادلات (DEX)" : "Swap Sandbox"}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 bg-slate-900/20 border border-slate-900 rounded-2xl p-5 shadow-2xl min-h-[450px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: File Workspace */}
              {activeTab === "workspace" && (
                <motion.div 
                  key="workspace"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col md:grid md:grid-cols-11 gap-4 flex-1 h-full"
                >
                  {/* File Sidebar (3 cols) */}
                  <div className="md:col-span-3 border-r md:border-r border-slate-850 pr-2 flex flex-col gap-1.5">
                    <span className="text-2xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
                      {language === "fa" ? "ساختار دایرکتوری هارد‌هت" : "Hardhat Workspace Tree"}
                    </span>
                    
                    {files.map((file, idx) => (
                      <button
                        key={file.path}
                        type="button"
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition duration-150 ${selectedFileIndex === idx ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-900/60 text-slate-400 hover:text-slate-200"}`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileCode className={`w-4 h-4 flex-shrink-0 ${selectedFileIndex === idx ? "text-emerald-400" : "text-slate-500"}`} />
                          <span className="truncate font-mono">{file.name}</span>
                        </div>
                        <span className="text-3xs font-semibold px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 uppercase">
                          {file.language}
                        </span>
                      </button>
                    ))}

                    <div className="mt-auto pt-4 border-t border-slate-900">
                      <div className="bg-slate-950 p-2 text-2xs text-slate-400 rounded-lg border border-slate-900">
                        <span className="text-slate-500 font-bold block mb-1">
                          {language === "fa" ? "📂 موقعیت ساخت فایل" : "📂 File Path Origin"}
                        </span>
                        <code className="text-amber-400 font-mono break-all">{activeFile.path}</code>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor Panel (8 cols) */}
                  <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-950/70 p-4 rounded-xl border border-slate-850/40">
                    <div className="border-b border-slate-850 pb-3 flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xs font-mono text-amber-500 block mb-0.5">{activeFile.path}</span>
                        <h3 className="text-sm font-semibold text-slate-200 font-sans">
                          {language === "fa" ? activeFile.descriptionFa : activeFile.descriptionEn}
                        </h3>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleCopyCode(activeFile.content, selectedFileIndex)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition duration-150 cursor-pointer"
                      >
                        {copiedFileIndex === selectedFileIndex ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {language === "fa" ? "کپی شد" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {language === "fa" ? "کپی کد استاندارد" : "Copy Complete Code"}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Pre-formatted code display */}
                    <div className="flex-1 overflow-x-auto max-h-[480px]">
                      <table className="w-full text-xs font-mono leading-relaxed text-slate-300">
                        <tbody>
                          {activeFile.content.split("\n").map((line, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/30">
                              <td className="text-slate-600 text-right pr-4 select-none pr-3 border-r border-slate-900 text-2xs w-8">
                                {idx + 1}
                              </td>
                              <td className="pl-4 whitespace-pre pr-2 text-slate-300">
                                {line}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-slate-900 pt-3 mt-4 flex items-center justify-between text-2xs text-slate-500">
                      <span>{language === "fa" ? "✔ فرمت معتبر Solidity 0.5.16 / 0.6.6" : "✔ Syntactically valid file compliant"}</span>
                      <span>{activeFile.content.split("\n").length} {language === "fa" ? "خط کد" : "Lines of Code"}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Deployer Simulator */}
              {activeTab === "deployer" && (
                <motion.div 
                  key="deployer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 flex-1 h-full flex flex-col justify-between"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-md font-bold text-slate-200">
                        {language === "fa" ? "شبیه‌ساز کامپایل و استقرار هارد‌هت" : "Simulated Compile & Deploy Engine"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {language === "fa" ? "ترتیب دیپلوی را شبیه‌سازی کنید تا آدرس جفت‌های نقدینگی و روتر را دریافت کنید." : "Simulate deploying Factory and Router sequently prior to production push."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startCompileSimulation}
                        disabled={compiling || deploying}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
                      >
                        <Cpu className={`w-3.5 h-3.5 ${compiling ? "animate-spin text-amber-500" : "text-slate-400"}`} />
                        {language === "fa" ? "۱. کامپایل کدهای صرافی" : "1. Compile Solidity"}
                      </button>

                      <button
                        type="button"
                        onClick={startDeploySimulation}
                        disabled={!compiled || deploying || deployed}
                        className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-900 disabled:text-slate-500 text-slate-950 font-bold tracking-tight transition cursor-pointer"
                      >
                        <Play className={`w-3.5 h-3.5 ${deploying ? "animate-ping" : ""}`} />
                        {language === "fa" ? "۲. شبیه‌سازی دیپلوی به TeQoin" : "2. Launch Deploy to TeQoin"}
                      </button>
                    </div>
                  </div>

                  {/* Simulated Terminal Screen */}
                  <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-2xs text-emerald-400 overflow-y-auto max-h-[300px]">
                    <span className="text-slate-500 block mb-2 border-b border-slate-900 pb-1.5 flex justify-between">
                      <span>{language === "fa" ? "📟 ترمینال محلی هارد‌هت" : "📟 Hardhat Solidity Compiler Terminal"}</span>
                      <span className="text-emerald-500">{language === "fa" ? "متصل به TeQoin EVM" : "Connected TeQoin Node"}</span>
                    </span>

                    {terminalLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-8 text-center flex flex-col items-center justify-center gap-2">
                        <Terminal className="w-8 h-8 opacity-40 text-emerald-500 animate-pulse" />
                        {language === "fa" 
                          ? "ترمینال آماده است. ابتدا دکمه 'کامپایل کدهای صرافی' و سپس 'شبیه‌سازی دیپلوی به TeQoin' را کلیک کنید."
                          : "Console idle. Press Compile then Deploy to observe real-time EVM logs."
                        }
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {terminalLogs.map((log, i) => (
                          <div key={i} className={
                            log.includes("SUCCESS") ? "text-emerald-300 font-bold" : 
                            log.includes("Error") ? "text-red-400 font-bold" : 
                            log.includes("Step") ? "text-amber-300 font-semibold" : 
                            "text-slate-400"
                          }>
                            {log}
                          </div>
                        ))}
                        {(compiling || deploying) && <span className="terminal-cursor" />}
                      </div>
                    )}
                  </div>

                  {/* Summary Box & DEX activation message */}
                  {deployed && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                    >
                      <div>
                        <span className="text-emerald-400 font-mono font-bold block mb-1">
                          🎉 {language === "fa" ? "اتصال با موفقیت انجام شد!" : "Deployment Simulation Completed!"}
                        </span>
                        <p className="text-slate-400">
                          {language === "fa" 
                            ? "آدرس‌های استقرار صرافی صادر شدند. هم‌اکنون می‌توانید در تب 'تست مبادلات (DEX)' فرمول قیمت‌گذاری Uniswap V2 را با توکن‌های تستی امتحان کنید!" 
                            : "Contract address resolved. Go to the 'Swap Sandbox' tab to interact with your Uniswap V2 liquidity ratio!"
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("simulator")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer"
                      >
                        {language === "fa" ? "برو به پنل مبادلات صرافی" : "Try Swap Sandbox Now"}
                      </button>
                    </motion.div>
                  )}

                </motion.div>
              )}

              {/* Tab 3: Swapping / Liquidity Simulation */}
              {activeTab === "simulator" && (
                <motion.div 
                  key="simulator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 flex-1 h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                    <div>
                      <h3 className="text-md font-bold text-slate-200">
                        {language === "fa" ? "شبیه‌ساز صرافی غیرمتمرکز (DEX) بر پایه Uniswap V2" : "Interactive Uniswap V2 Liquidity Pool"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {language === "fa" ? "درک فرمول ضرب ثابت (Constant Product) و درصد لغزش قیمت (Price Slippage)" : "Understand the x * y = K pricing math under real state updates."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetPools}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {language === "fa" ? "بودوجه استخر را ریست کن" : "Reset pool reserves"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Active pool reserves visual states (4 cols) */}
                    <div className="md:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-4">
                      <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-widest block">
                        {language === "fa" ? "📊 ذخیره استخر نقدینگی نهایی" : "📊 Active Pool Balance"}
                      </span>

                      <div className="space-y-3.5">
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-850">
                          <span className="text-xs text-slate-500 block mb-1">
                            {language === "fa" ? `موجودی توکن ${tokenA}` : `Reserve ${tokenA}`}
                          </span>
                          <span className="text-lg font-mono font-bold text-emerald-400">
                            {reserveA.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-850">
                          <span className="text-xs text-slate-500 block mb-1">
                            {language === "fa" ? `موجودی توکن ${tokenB}` : `Reserve ${tokenB}`}
                          </span>
                          <span className="text-lg font-mono font-bold text-teal-400">
                            {reserveB.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900/40 p-3 rounded-lg border border-dashed border-slate-850 text-2xs text-slate-500">
                        <span className="block mb-1 font-mono text-slate-400">
                          K Constant: <strong className="text-emerald-400">{(reserveA * reserveB).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        </span>
                        {language === "fa" 
                          ? "فرمول ضرب ثابت میگوید reservesA * reservesB همواره برابر با K است و قیمت بر اساس نسبت تغییر میکند." 
                          : "Any trade shifts reserves, keeping constant product K protected."
                        }
                      </div>
                    </div>

                    {/* Swap Panel Simulation (8 cols) */}
                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left side within 8cols: Add Liquidity */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                        <div>
                          <span className="text-2xs font-bold text-slate-400 block mb-2">
                            {language === "fa" ? "➕ افزودن نقدینگی (Add Liquidity)" : "➕ Add LP Liquidity"}
                          </span>
                          <p className="text-3xs text-slate-500 mb-4">
                            {language === "fa" ? "نسبت فعلی استخر را حفظ کنید تا توکن نقدینگی مِنت کنید." : "Supply dual assets relative to active deposit index ratio."}
                          </p>

                          <div className="space-y-2.5">
                            <div>
                              <label className="text-3xs text-slate-500 block mb-1" htmlFor="add-qty-a-input">{language === "fa" ? `تعداد توکن ${tokenA}` : `Input ${tokenA}`}</label>
                              <input 
                                id="add-qty-a-input"
                                type="number" 
                                placeholder="100" 
                                value={addQtyA}
                                onChange={(e) => {
                                  setAddQtyA(e.target.value);
                                  // Maintain ratio
                                  const ratio = reserveB / reserveA;
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) setAddQtyB((val * ratio).toFixed(2));
                                }}
                                className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded p-2 text-slate-100"
                              />
                            </div>

                            <div>
                              <label className="text-3xs text-slate-500 block mb-1" htmlFor="add-qty-b-input">{language === "fa" ? `تعداد توکن ${tokenB}` : `Input ${tokenB}`}</label>
                              <input 
                                id="add-qty-b-input"
                                type="number" 
                                placeholder="300" 
                                value={addQtyB}
                                onChange={(e) => {
                                  setAddQtyB(e.target.value);
                                  const ratio = reserveA / reserveB;
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) setAddQtyA((val * ratio).toFixed(2));
                                }}
                                className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded p-2 text-slate-100"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddLiquiditySim}
                          className="w-full mt-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold rounded text-emerald-400 transition"
                        >
                          {language === "fa" ? "ثبت نقدینگی به استخر" : "Confirm Liquidity Provision"}
                        </button>
                      </div>

                      {/* Right side within 8cols: Active Swapper UX */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-2xs font-bold text-slate-400">
                              {language === "fa" ? "🔄 تبادل توکن (Swap Sandbox)" : "🔄 Execute Swap"}
                            </span>
                            <button 
                              type="button"
                              onClick={() => {
                                setSwapDirection(d => d === "AtoB" ? "BtoA" : "AtoB");
                              }}
                              className="text-3xs text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10 cursor-pointer hover:bg-emerald-500/20"
                            >
                              {language === "fa" ? "معکوس کردن جهت" : "Invert Input"}
                            </button>
                          </div>
                          
                          <p className="text-3xs text-slate-500 mb-4 animate-pulse">
                            {swapDirection === "AtoB" ? `${tokenA} ➔ ${tokenB}` : `${tokenB} ➔ ${tokenA}`}
                          </p>

                          <div className="space-y-2.5">
                            <div>
                              <label className="text-3xs text-slate-500 block mb-1" htmlFor="swap-input-field">
                                {language === "fa" ? `مقدار ورودی (${swapDirection === "AtoB" ? tokenA : tokenB})` : `In amount`}
                              </label>
                              <input 
                                id="swap-input-field"
                                type="number" 
                                placeholder="10" 
                                value={swapInput}
                                onChange={(e) => setSwapInput(e.target.value)}
                                className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded p-2 text-slate-100"
                              />
                            </div>

                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-855 text-2xs space-y-1 text-slate-400">
                              <div className="flex justify-between font-mono">
                                <span>{language === "fa" ? "خروجی تخمینی:" : "Estimated output:"}</span>
                                <span className="text-emerald-400 font-bold">{swapOutput.toFixed(4)}</span>
                              </div>
                              <div className="flex justify-between text-3xs">
                                <span>{language === "fa" ? "تاثیر قیمت (Slippage):" : "Slippage / Impact:"}</span>
                                <span className={priceImpact > 5 ? "text-amber-500" : "text-slate-500"}>
                                  {priceImpact.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleExecuteSwapSim}
                          className="w-full mt-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded transition"
                        >
                          {language === "fa" ? "تبادل فوری (Swap)" : "Confirm Asset Swapping"}
                        </button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: GitHub Actions automation blueprint guide */}
              {activeTab === "github" && (
                <motion.div 
                  key="github"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-5 flex-1 h-full flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-md font-bold text-slate-200">
                      {language === "fa" ? "راهنمای استقرار خودکار با گیت هاب اکشنز" : "GitHub Actions Automated Deployment workflow"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === "fa" ? "با استفاده از این اتوماسیون، به محض Push شدن کدهایتان بر روی برنچ اصلی، صرافی روی TeQoin آپلود خواهد شد." : "Automatically build, compile, and execute Hardhat deploy scripts upon repository code push."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">۱</div>
                      <h4 className="text-xs font-bold text-slate-300">
                        {language === "fa" ? "ساخت فایل گردش‌کار" : "1. Setup YAML file in Repo"}
                      </h4>
                      <p className="text-2xs text-slate-500">
                        {language === "fa" 
                          ? "فایل deploy.yml موجود در تب دایرکتوری هارد‌هت را در مسیر `.github/workflows/deploy.yml` پروژه خود بسازید."
                          : "Save the deploy.yml template inside your repository folder structure identical to .github/workflows/deploy.yml."
                        }
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">۲</div>
                      <h4 className="text-xs font-bold text-slate-300">
                        {language === "fa" ? "ثبت کلید خصوصی در کدهای مخفی" : "2. Configure GitHub Secrets"}
                      </h4>
                      <p className="text-2xs text-slate-500">
                        {language === "fa" 
                          ? "به تنظیمات ریپازیتوری رفته و در قسمت Settings ➔ Secrets ➔ Actions، کلید مخفی با عنوان 'PRIVATE_KEY' ایجاد کرده و کلید کیف پول خود را در آن ذخیره کنید."
                          : "Navigate into repository Settings -> SECRETS -> ACTIONS, create a new Repository Secret labeled PRIVATE_KEY storing your EVM deployer account key."
                        }
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">۳</div>
                      <h4 className="text-xs font-bold text-slate-300">
                        {language === "fa" ? "اجرای اتوماسیون با Push" : "3. Trigger Automated Deploy"}
                      </h4>
                      <p className="text-2xs text-slate-500">
                        {language === "fa" 
                          ? "آخرین کار را در گیت Commit کرده و به branch بروید. GitHub Actions به صورت خودکار شروع به کامپایل و استقرار صرافی می‌کند."
                          : "Push the modifications. GitHub workflows executes testing steps sequentially, deploying factory + router with zero manual setup."
                        }
                      </p>
                    </div>

                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-2xs space-y-2 text-slate-400">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Lock className="w-4 h-4" />
                      <strong>{language === "fa" ? "امنیت در گیت‌هاب اکشنز" : "GitHub Actions Key Security Policies"}</strong>
                    </div>
                    <p>
                      {language === "fa" 
                        ? "⚠️ هرگز کلیدهای خصوصی خود را درون کدهایی مثل hardhat.config.js یا deploy.js به طور مستقیم وارد نکنید! این کار دارایی شما را با خطر هک مواجه میکند. همیشه از secrets.PRIVATE_KEY گیت‌هاب استفاده کنید که طبق استانداردهای پیشرو هش شده و در فرآیند استخراج لاگ‌ها فیلتر می‌شود."
                        : "⚠️ Strictly avoid committing raw plain private key strings inside hardhat.config.js or deploy scripts. Storing them under GitHub Secrets is compliance-safe and guarantees secret sanitization during console logs parsing."
                      }
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

        {/* Right Column (4-cols): AI Solidity assistant and educational help */}
        <div className="lg:col-span-4 flex flex-col gap-6 bg-slate-900/50 rounded-2xl border border-slate-900 p-5 shadow-2xl h-[700px] justify-between">
          
          <div className="flex flex-col gap-1 b-2 border-b border-slate-900 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-200">
                {language === "fa" ? "دستیار هوشمند و مشاوره سالیدیتی صرافی" : "Solidity Smart Contract AI Copilot"}
              </h3>
            </div>
            <p className="text-2xs text-slate-400">
              {language === "fa" ? "از هوش مصنوعی در مورد منطق Uniswap V2 یا استقرار سوال کنید." : "Ask questions regarding constant product formulas or deployment errors."}
            </p>
          </div>

          {/* Interactive Chat interface displaying messages */}
          <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.sender === "user" ? "items-start text-xs align-left" : "items-end text-xs align-right"}`}
              >
                <div className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${msg.sender === "user" ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" : "bg-emerald-950/40 text-emerald-300 rounded-tr-none border border-emerald-500/20"}`}>
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {aiLoading && (
              <div className="flex gap-1.5 items-center text-xs text-slate-500 italic">
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-500" />
                <span>{language === "fa" ? "درحال مشورت با جفت‌های بلاکچینی..." : "Gemini is thinking..."}</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Educational Quick Suggestion Prompts */}
          <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
            <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider block">
              {language === "fa" ? "💡 مباحث آموزشی کلیدی:" : "💡 Quick Educational Topics:"}
            </span>
            
            <div className="grid grid-cols-2 gap-1.5 text-3xs">
              <button
                type="button"
                onClick={() => explainGeneralConcept("what_is_v2")}
                className="p-1 px-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-left text-slate-400 truncate cursor-pointer"
              >
                {language === "fa" ? "۱. معرفی Uniswap V2" : "1. Intro Uniswap V2"}
              </button>

              <button
                type="button"
                onClick={() => explainGeneralConcept("how_factory_works")}
                className="p-1 px-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-left text-slate-400 truncate cursor-pointer"
              >
                {language === "fa" ? "۲. نحوه کارکرد Factory" : "2. How Factory works"}
              </button>

              <button
                type="button"
                onClick={() => explainGeneralConcept("deploy_issues")}
                className="p-1 px-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-left text-slate-400 truncate cursor-pointer"
              >
                {language === "fa" ? "۳. پیامدهای گاز در استقرار" : "3. Deployment Gas issues"}
              </button>

              <button
                type="button"
                onClick={() => explainGeneralConcept("git_secrets")}
                className="p-1 px-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-left text-slate-400 truncate cursor-pointer"
              >
                {language === "fa" ? "۴. کلیدهای ایمن گیت‌هاب" : "4. Securing Git Secrets"}
              </button>
            </div>
          </div>

          {/* Prompt Entry Box */}
          <form onSubmit={handleAskAI} className="mt-3 flex gap-2 border-t border-slate-900 pt-3">
            <input 
              id="chat-input-box"
              type="text"
              placeholder={language === "fa" ? "مثال: نحوه محاسبه Constant Product چیست؟..." : "Type custom compiler or Solidity audit questions..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            
            <button
              type="submit"
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg font-bold transition flex items-center justify-center cursor-pointer"
              aria-label={language === "fa" ? "ارسال سوال به هوش مصنوعی" : "Send query to AI"}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-3xs text-slate-600 flex justify-between">
        <span>© 2026 TeQoin Developer Ecosystem. All smart contract structures comply with the original Uniswap V2 Open Source specifications.</span>
        <span>Developer Hub Sandbox 1.0</span>
      </footer>

    </div>
  );
}
