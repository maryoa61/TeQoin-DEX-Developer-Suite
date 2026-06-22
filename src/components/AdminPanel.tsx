import React, { useState } from "react";
import { 
  Cpu, 
  Settings, 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Github, 
  Sparkles, 
  HelpCircle, 
  Send, 
  Info, 
  ArrowUpRight,
  ShieldAlert,
  Terminal,
  Plus
} from "lucide-react";
import { AdminPanelProps } from "../types";

export function AdminPanel({
  language,
  rpcUrl,
  setRpcUrl,
  chainId,
  setChainId,
  wethAddress,
  setWethAddress,
  feeSetter,
  setFeeSetter,
  projectName,
  setProjectName,
  factoryAddress,
  setFactoryAddress,
  routerAddress,
  setRouterAddress,
  token0Address,
  setToken0Address,
  token1Address,
  setToken1Address,
  addTaQoinNetwork,
  currentSymbol,
  explorerUrl,
  files,
  selectedFileIndex,
  setSelectedFileIndex,
  copiedFileIndex,
  handleCopyCode,
  activeFile,
  chatInput,
  setChatInput,
  chatHistory,
  aiLoading,
  handleAskAI,
  setQuestionSnippet,
}: AdminPanelProps) {
  // Let's have nested tabs to organize the heavy developer dashboard logically
  const [nestedTab, setNestedTab] = useState<"configs" | "contracts" | "github" | "copilot">("configs");

  return (
    <div className="bg-slate-900 border border-indigo-950 rounded-3xl p-6 shadow-2xl mt-8">
      {/* Admin Panel Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
                {language === "fa" ? "منطقه ابزارهای توسعه و مدیریت هوشمند" : "Developer Tools & Admin Hub"}
              </h2>
              <span className="bg-indigo-505 bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono font-bold">
                ADMIN_SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === "fa"
                ? "مدیریت قراردادهای سالیدیتی، پایش پایپلاین و مشورت با مدل‌های پیشرفته هوش مصنوعی"
                : "Manage EVM variables, view local Solidity code templates, configure pipelines, or consult with Gemini."}
            </p>
          </div>
        </div>

        {/* Nested Tabs list */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-850">
          <button
            onClick={() => setNestedTab("configs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nestedTab === "configs"
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {language === "fa" ? "پیکربندی هوشمند" : "Config Variables"}
          </button>
          
          <button
            onClick={() => setNestedTab("contracts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nestedTab === "contracts"
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {language === "fa" ? "کدهای سالیدیتی" : "Solidity Workspace"}
          </button>

          <button
            onClick={() => setNestedTab("github")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nestedTab === "github"
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {language === "fa" ? "بسته‌بندی گیت هاب" : "GitHub Actions CI"}
          </button>

          <button
            onClick={() => setNestedTab("copilot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              nestedTab === "copilot"
                ? "bg-indigo-900/40 text-indigo-300 border border-indigo-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {language === "fa" ? "دستیار صرافی هوش مصنوعی" : "DEX Copilot AI"}
          </button>
        </div>
      </div>

      {/* Dynamic Content Switching inside nested active selections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* =============== NESTED TAB 1: VARIABLE CONFIGS =============== */}
        {nestedTab === "configs" && (
          <>
            {/* MetaMask automated network addition helper details */}
            <div className="lg:col-span-5 bg-slate-950/50 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  {language === "fa" ? "افزودن شبکه متامسک" : "MetaMask RPC Bridge"}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {language === "fa" 
                  ? "شبکه آزمایشی بومی را مستقیماً از دافعه زیر با یک کلیک به افزونه مرورگر خود معرفی کنید:"
                  : "Register our live EVM consensus configuration profile definitions over into your MetaMask browser client suite."}
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1.5 text-slate-400">
                <div><span className="text-slate-500">RPC NETWORK GATEWAY:</span> {rpcUrl}</div>
                <div><span className="text-slate-500">CHAIN ID PARAM:</span> {chainId}</div>
                <div><span className="text-slate-500">GAS COIN WEIGHT:</span> {currentSymbol}</div>
                <div><span className="text-slate-500">SCAN EXPLORER HUB:</span> {explorerUrl}</div>
              </div>

              <button
                onClick={addTaQoinNetwork}
                className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-405" />
                {language === "fa" ? "امضا و تنظیم شبکه TaQoin در کیف پول" : "Add TaQoin Profile to MetaMask"}
              </button>
            </div>

            {/* Config variable inputs edit fields */}
            <div className="lg:col-span-7 bg-slate-950/20 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  {language === "fa" ? "تنظیم متغیرهای مرجع قراردادها" : "Smart Contract Variable Anchors"}
                </h3>
              </div>

              <p className="text-xs text-slate-400">
                {language === "fa"
                  ? "آدرس قراردادهایی که در بلاکچین دیپلوی کرده‌اید اینجا مدیریت کنید تا برنامه آن‌ها را پایش کند:"
                  : "Sync local state with on-chain deployed ledger contract hashes to test swap logic parameters in realtime:"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-1">FACTORY ADDRESS:</label>
                  <input 
                    type="text" 
                    value={factoryAddress} 
                    onChange={(e) => setFactoryAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-1">ROUTER02 ADDRESS:</label>
                  <input 
                    type="text" 
                    value={routerAddress} 
                    onChange={(e) => setRouterAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-1">TOKEN 0 REPRESENTATIVE ({currentSymbol}):</label>
                  <input 
                    type="text" 
                    value={token0Address} 
                    onChange={(e) => setToken0Address(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-1">TOKEN 1 REPRESENTATIVE (USDT):</label>
                  <input 
                    type="text" 
                    value={token1Address} 
                    onChange={(e) => setToken1Address(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* =============== NESTED TAB 2: SOLIDITY WORKSPACE =============== */}
        {nestedTab === "contracts" && (
          <>
            {/* Folder / File list left panel */}
            <div className="lg:col-span-4 bg-slate-950/20 p-4 rounded-2xl border border-slate-850 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-emerald-500" />
                CONTRACTS WORKSPACE
              </h3>

              <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
                {files.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition duration-150 ${
                      selectedFileIndex === idx 
                        ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" 
                        : "text-slate-400 hover:bg-slate-950 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <FileCode className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selectedFileIndex === idx ? "text-indigo-400" : "text-slate-500"}`} />
                    <div className="truncate">
                      <p className="font-mono font-bold leading-none truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 truncate leading-none mt-1 font-sans">
                        {language === "fa" ? file.descriptionFa : file.descriptionEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 mt-2 text-[10px] font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>COMPILER:</span>
                  <span className="text-slate-300">0.5.16 / 0.6.6</span>
                </div>
                <div className="flex justify-between">
                  <span>OPTIMIZATION RUNS:</span>
                  <span className="text-indigo-400">999999</span>
                </div>
              </div>
            </div>

            {/* Solidity Content Viewer right panel */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Extra helper params adjust bar */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-0.5">RPC GATEWAY URL:</label>
                  <input 
                    type="text" 
                    value={rpcUrl} 
                    onChange={(e) => setRpcUrl(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 roundedpx px-2 py-1 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-0.5">WRAPPED NATIVE (WETH):</label>
                  <input 
                    type="text" 
                    value={wethAddress} 
                    onChange={(e) => setWethAddress(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 roundedpx px-2 py-1 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-mono font-bold mb-0.5">FEE RECEIVER ADDRS:</label>
                  <input 
                    type="text" 
                    value={feeSetter} 
                    onChange={(e) => setFeeSetter(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 roundedpx px-2 py-1 text-xs text-slate-300 font-mono focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-955 bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-slate-950 border-b border-slate-900 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-300 font-bold">{activeFile.path}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(activeFile.content, selectedFileIndex)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-440 font-sans transition-all cursor-pointer"
                  >
                    {copiedFileIndex === selectedFileIndex ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-400 text-[10px] font-bold">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px]">کپی کد منبع</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 font-mono text-[11px] overflow-auto max-h-[380px] leading-relaxed bg-slate-950 text-slate-300 whitespace-pre">
                  {activeFile.content}
                </div>
              </div>
            </div>
          </>
        )}

        {/* =============== NESTED TAB 3: GITHUB PIPELINE WORKFLOW =============== */}
        {nestedTab === "github" && (
          <>
            <div className="lg:col-span-8 bg-slate-950/20 p-5 rounded-2xl border border-slate-850 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Github className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-100">
                  {language === "fa" ? "مراحل نهایی استقرار اتوماتیک با Github Action" : "GitHub CI/CD Deployment Guide"}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {language === "fa"
                  ? "با کوچک‌ترین تغییر روی شاخه اصلی مخزن گیت‌هاب، تراکنش‌های زنده کامپایل و گارد به گارد دیپلوی به طور مستقیم و امن روی شبکه تست‌نت انجام خواهد شد:"
                  : "To setup continuous deployment pipelines with Github Action, follow these instructions to define Repository Secrets on your project repository:"}
              </p>

              <div className="space-y-4 my-2">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-emerald-400 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-200">{language === "fa" ? "تنظیم پوشه‌های مخزن گیت‌هاب" : "Navigate to Settings"}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{language === "fa" ? "وارد اکانت شده و روی زبونه Settings در مخرن کلیک کنید." : "Open your exported github repository link, go into GitHub Settings panel."}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-emerald-400 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-200">{language === "fa" ? "ثبت سکرت‌های امنیتی گیت‌هاب" : "Config Automation Secrets"}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      {language === "fa" 
                        ? "به مسیر Settings -> Secrets and variables -> Actions بروید و رمزهای محرمانه زیر را بنویسید:" 
                        : "Initialize action parameters by configuring custom repository secrets in target sections:"}
                    </p>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-855 font-mono text-[10px] text-slate-400 mt-2 space-y-1">
                      <div>• <span className="text-emerald-400 font-bold">PRIVATE_KEY</span>: <span className="text-slate-500">{language === "fa" ? "کلید خصوصی ولت دیپلوی‌کننده دارای موجودی تست تستی" : "Your EVM core deployer account key bytes"}</span></div>
                      <div>• <span className="text-emerald-400 font-bold">TEQOIN_RPC_URL</span>: <span className="text-slate-500">{rpcUrl}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-emerald-400 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-200">{language === "fa" ? "دیپلوی خودکار صرافی با هر Push" : "Push Changes to main"}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{language === "fa" ? "با کوچک‌ترین push گیت‌هاب اکشنز رول تراکنش را روی بلاکچین TaQoin ثبت می‌کند." : "Commit any contract modify on master, and compiler automations register contracts to the ledger index dynamically!"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                <span className="font-mono text-[9px] text-slate-550 block font-bold tracking-wider">WORKFLOW BLUEPRINT:</span>
                
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {language === "fa"
                    ? "سورس کد جریان کار اتوماتیک گیت‌هاب اکشنز پروژه شما:"
                    : "The custom automation descriptor is committed physically inside your directory:"}
                </p>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[9px] text-slate-450 leading-snug overflow-auto max-h-[190px]">
                  {files[3]?.content}
                </div>
              </div>
            </div>
          </>
        )}

        {/* =============== NESTED TAB 4: SOL COPILOT CHAT =============== */}
        {nestedTab === "copilot" && (
          <>
            {/* Quick Prompts Left Col */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-200 font-mono tracking-wide uppercase">
                    {language === "fa" ? "مباحث راهنما و اتوماسیون" : "Solid EVM Topics"}
                  </h3>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
                  {language === "fa"
                    ? "برای کپی مفهوم موضوع در کادر تایپ گفتگو، روی هر کلید کلید موضوعی لمس کنید:"
                    : "Load instant contextual templates regarding automated swap mechanics into AI input box:"}
                </p>

                <div className="flex flex-col gap-1.5 font-sans">
                  <button
                    onClick={() => setQuestionSnippet("ethers_connect")}
                    className="p-2 rounded-lg bg-slate-955 bg-slate-950 text-left text-[10px] hover:bg-slate-850 transition duration-150 border border-slate-850 text-slate-300"
                  >
                    ⚡ {language === "fa" ? "روش اتصال ابزارهای ethers.js به Router" : "Hooking App states with Ethers"}
                  </button>

                  <button
                    onClick={() => setQuestionSnippet("token_approve")}
                    className="p-2 rounded-lg bg-slate-955 bg-slate-950 text-left text-[10px] hover:bg-slate-850 transition duration-150 border border-slate-850 text-slate-300"
                  >
                    ⚡ {language === "fa" ? "دلیل تایید تاییدیه Approve توکن ورودی" : "Understanding Token Approvals"}
                  </button>

                  <button
                    onClick={() => setQuestionSnippet("deploy_hardhat")}
                    className="p-2 rounded-lg bg-slate-955 bg-slate-950 text-left text-[10px] hover:bg-slate-850 transition duration-150 border border-slate-850 text-slate-300"
                  >
                    ⚡ {language === "fa" ? "نحوه دیپلوی با اسکریپت هارد‌هت" : "Hardhat setup & deployer scripts"}
                  </button>

                  <button
                    onClick={() => setQuestionSnippet("verify_contract")}
                    className="p-2 rounded-lg bg-slate-955 bg-slate-950 text-left text-[10px] hover:bg-slate-850 transition duration-150 border border-slate-850 text-slate-300"
                  >
                    ⚡ {language === "fa" ? "احراز ایمن در شبکه TaQoin Explorer" : "Verification inside EVM Explorers"}
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Terminal right col */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 flex flex-col h-[420px] justify-between">
                
                {/* AI Chat Header details */}
                <div className="border-b border-slate-850/80 pb-2.5 mb-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <h4 className="text-xs font-bold text-slate-200 font-sans">
                      {language === "fa" ? "مشاور اتوماسیون و مربی هوشمند توسعه TeQoin" : "Gemini DEX Copilot Core"}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold">MODEL_GEMINI_3.5_FLASH</span>
                </div>

                {/* Chat Message Lists */}
                <div className="flex-1 overflow-auto space-y-3.5 pr-1 scrollbar-thin">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-650 text-slate-100 font-medium rounded-tr-none"
                            : "bg-slate-950 text-slate-200 border border-slate-850 rounded-tl-none whitespace-pre-wrap"
                        }`}
                      >
                        <p className="font-sans text-[11px]">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-950 border border-slate-850 rounded-2xl rounded-tl-none p-3 text-[11px] text-slate-400 flex items-center gap-2">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </span>
                        <span>{language === "fa" ? "در حال پردازش مفاهیم..." : "Processing solidity variables..."}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Question asking form input */}
                <form onSubmit={handleAskAI} className="mt-3.5 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={language === "fa" ? "توضیح کدها یا الگوهای دیپلوی..." : "Ask Copilot logic questions..."}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:border-indigo-500 outline-none font-sans"
                    required
                  />

                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-100" />
                  </button>
                </form>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
