import React, { FormEvent, useState } from "react";
import { ArrowLeftRight, Check, RefreshCw, Info, ArrowUpRight, HelpCircle, Search, Plus, X } from "lucide-react";
import { SwapTabProps } from "../types";

export interface TokenItem {
  symbol: string;
  name: string;
  address: string;
  logo: string;
}

export function SwapTab({
  language,
  currentSymbol,
  explorerUrl,
  walletConnected,
  swapType,
  setSwapType,
  swapAmountIn,
  setSwapAmountIn,
  swapAmountOutMin,
  setSwapAmountOutMin,
  swapTokenIn,
  setSwapTokenIn,
  swapTokenOut,
  setSwapTokenOut,
  token0Address,
  token1Address,
  wethAddress,
  swapTxMining,
  approveTxMining,
  swapTxHash,
  approveTxHash,
  swapStatusText,
  triggerApproveForSwap,
  triggerExecuteSwap,
}: SwapTabProps) {
  // Token selection states
  const [isSelectingFor, setIsSelectingFor] = useState<"in" | "out" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customTokens, setCustomTokens] = useState<TokenItem[]>([]);

  // Calculate local fallback safe addresses to guard against empty strings
  const activeWeth = wethAddress || "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const activeT0 = token0Address || "0x6cC35D27dEc15F8adeC439cD969989B0b03D5979";
  const activeT1 = token1Address || "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  // Pre-configured list of mock and test tokens
  const presetTokens: TokenItem[] = [
    {
      symbol: currentSymbol,
      name: currentSymbol === "ETH" ? "Ethereum (Native Utility Gas)" : "TaQoin (Native Utility Gas)",
      address: "native",
      logo: "💎",
    },
    {
      symbol: `W${currentSymbol}`,
      name: `Wrapped ${currentSymbol}`,
      address: activeWeth,
      logo: "🌀",
    },
    {
      symbol: "TST0",
      name: "TaQoin Test Token 0",
      address: activeT0,
      logo: "🦄",
    },
    {
      symbol: "TST1",
      name: "TaQoin Test Token 1",
      address: activeT1,
      logo: "🦁",
    },
    {
      symbol: "TST2",
      name: "Uniswap Test Token 2",
      address: "0x1111111111111111111111111111111111111111",
      logo: "🪙",
    },
    {
      symbol: "TST3",
      name: "Chainlink Test Token 3",
      address: "0x2222222222222222222222222222222222222222",
      logo: "🧪",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x3333333333333333333333333333333333333333",
      logo: "₿",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x4444444444444444444444444444444444444444",
      logo: "💵",
    },
  ];

  const availableTokens = [...presetTokens, ...customTokens];

  // Map the current props states back to actual Token items for display
  const selectedInToken = swapType === "eth_to_tokens"
    ? availableTokens.find(t => t.address === "native")
    : availableTokens.find(t => t.address.toLowerCase() === swapTokenIn.toLowerCase());

  const selectedOutToken = availableTokens.find(t => t.address.toLowerCase() === swapTokenOut.toLowerCase());

  const displayInToken = selectedInToken || {
    symbol: swapType === "eth_to_tokens" ? currentSymbol : "CUST-IN",
    name: "Custom Utility Token",
    address: swapTokenIn,
    logo: "🪄"
  };

  const displayOutToken = selectedOutToken || {
    symbol: "CUST-OUT",
    name: "Custom Input Token",
    address: swapTokenOut,
    logo: "🪄"
  };

  // Live filter list based on Search terms
  const filteredTokens = availableTokens.filter(token => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      token.symbol.toLowerCase().includes(q) ||
      token.name.toLowerCase().includes(q) ||
      token.address.toLowerCase().includes(q)
    );
  });

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  // Add custom Token from Search input on-the-fly dynamically!
  const addCustomTokenFromSearch = (address: string) => {
    const hex = address.trim().toLowerCase();
    // Check duplication
    if (availableTokens.some(t => t.address.toLowerCase() === hex)) return;

    const shortSymbol = "CUST-" + hex.slice(2, 6).toUpperCase();
    const newToken: TokenItem = {
      symbol: shortSymbol,
      name: "Imported Custom Ledger " + hex.slice(0, 8),
      address: hex,
      logo: "🪄",
    };
    setCustomTokens(prev => [...prev, newToken]);
    selectToken(newToken);
  };

  // Perform safe updates on Parent states
  const selectToken = (tk: TokenItem) => {
    if (isSelectingFor === "in") {
      if (tk.address === "native") {
        setSwapType("eth_to_tokens");
        // Divert out token if it matches the wrapping address
        if (swapTokenOut.toLowerCase() === activeWeth.toLowerCase()) {
          setSwapTokenOut(activeT0.toLowerCase() === activeWeth.toLowerCase() ? activeT1 : activeT0);
        }
      } else {
        setSwapType("tokens_to_tokens");
        setSwapTokenIn(tk.address);
        // Avoid identical asset swaporams
        if (tk.address.toLowerCase() === swapTokenOut.toLowerCase()) {
          setSwapTokenOut(tk.address.toLowerCase() === activeT0.toLowerCase() ? activeT1 : activeT0);
        }
      }
    } else if (isSelectingFor === "out") {
      if (tk.address === "native") {
        // Enforce wrapping for output path integrity in standard Router
        setSwapTokenOut(activeWeth);
      } else {
        setSwapTokenOut(tk.address);
        if (swapType === "tokens_to_tokens" && tk.address.toLowerCase() === swapTokenIn.toLowerCase()) {
          setSwapTokenIn(tk.address.toLowerCase() === activeT0.toLowerCase() ? activeT1 : activeT0);
        }
      }
    }
    setIsSelectingFor(null);
    setSearchQuery("");
  };

  return (
    <div className="max-w-md w-full mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative subtle header line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 opacity-80" />

      {/* Screen 1: Active Swap Main View */}
      <div>
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" ? "تبادل ارز هوشمند" : "Swap Cryptos"}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === "fa" ? "نرخ آنی بازار و تبادل با تعهد متامسک" : "Instant liquidity rates & secure swaps"}
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-md">
            ROUTER_V2
          </span>
        </div>

        {/* Swap Type tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-850 mb-5">
          <button
            onClick={() => {
              setSwapType("eth_to_tokens");
              // reset swap settings if needed
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
              swapType === "eth_to_tokens"
                ? "bg-slate-800 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            type="button"
          >
            {language === "fa" ? `کوین بومی (${currentSymbol})` : `Native ${currentSymbol}`}
          </button>
          <button
            onClick={() => {
              setSwapType("tokens_to_tokens");
              if (swapTokenIn === "native" || !swapTokenIn) {
                setSwapTokenIn(activeT0);
              }
            }}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
              swapType === "tokens_to_tokens"
                ? "bg-slate-800 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            type="button"
          >
            {language === "fa" ? "مبادله توکن (ERC20)" : "ERC20 Token Pair"}
          </button>
        </div>

        <form onSubmit={triggerExecuteSwap} className="space-y-4">
          {/* Pay Input Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 transition-all hover:border-slate-800">
            <label className="block text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">
              {language === "fa" ? "میزان پرداختی" : "You Pay"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={swapAmountIn}
                onChange={(e) => setSwapAmountIn(e.target.value)}
                className="flex-1 bg-transparent border-none text-xl text-slate-100 font-mono focus:outline-none placeholder-slate-600"
                placeholder="0.0"
                required
              />
              
              {/* Dynamic click token select button */}
              <button
                type="button"
                onClick={() => setIsSelectingFor("in")}
                className="bg-slate-900 hover:bg-slate-850 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-100 border border-slate-800 hover:border-emerald-500/20 flex items-center gap-2 transition duration-150 font-mono whitespace-nowrap cursor-pointer shadow-md select-none"
              >
                <span className="text-sm">{displayInToken.logo}</span>
                <span>{displayInToken.symbol}</span>
                <span className="text-[9px] text-slate-500">▼</span>
              </button>
            </div>
          </div>

          {/* Minimal Middle arrow */}
          <div className="flex justify-center -my-3.5 relative z-10">
            <button
              type="button"
              onClick={() => {
                // Swap places if both are ERC20s
                if (swapType === "tokens_to_tokens") {
                  const temp = swapTokenIn;
                  setSwapTokenIn(swapTokenOut);
                  setSwapTokenOut(temp);
                } else {
                  // Switch swap type
                  setSwapType("tokens_to_tokens");
                  setSwapTokenIn(swapTokenOut);
                  setSwapTokenOut(activeWeth);
                }
              }}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-300 p-2.5 rounded-xl text-emerald-400 shadow-md cursor-pointer transition duration-200 active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Receive Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 transition-all hover:border-slate-800">
            <label className="block text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">
              {language === "fa" ? "حداقل دریافتی (لغزش)" : "Minimum Receive"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={swapAmountOutMin}
                onChange={(e) => setSwapAmountOutMin(e.target.value)}
                className="flex-1 bg-transparent border-none text-xl text-slate-100 font-mono focus:outline-none placeholder-slate-600"
                placeholder="0.0"
                required
              />
              
              {/* Dynamic click token select button */}
              <button
                type="button"
                onClick={() => setIsSelectingFor("out")}
                className="bg-slate-900 hover:bg-slate-850 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-100 border border-slate-800 hover:border-emerald-500/20 flex items-center gap-2 transition duration-150 font-mono whitespace-nowrap cursor-pointer shadow-md select-none"
              >
                <span className="text-sm">{displayOutToken.logo}</span>
                <span>{displayOutToken.symbol}</span>
                <span className="text-[9px] text-slate-500">▼</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              {language === "fa" ? "محاسبه بر اساس بدترین نرخ لغزش استخر" : "Calculated with slippage threshold limits."}
            </p>
          </div>

          {/* Dynamic Address Informational Badge Footnotes */}
          <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">{language === "fa" ? "آدرس مبدأ:" : "From (Token In):"}</span>
              {swapType === "eth_to_tokens" ? (
                <span className="text-slate-500">{language === "fa" ? "کوین بومی لایه شبکه" : "Native Gas Coin"}</span>
              ) : (
                <span className="text-emerald-400 font-bold tracking-tighter truncate max-w-[200px] select-all">
                  {swapTokenIn}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">{language === "fa" ? "آدرس مقصد:" : "To (Token Out):"}</span>
              <span className="text-sky-400 font-bold tracking-tighter truncate max-w-[200px] select-all">
                {swapTokenOut}
              </span>
            </div>

            {swapType === "tokens_to_tokens" && (
              <div className="bg-teal-500/5 text-emerald-300 text-[10px] p-2.5 rounded-xl border border-emerald-500/10 leading-relaxed flex items-start gap-2 mt-1">
                <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  {language === "fa"
                    ? "جهت مبادله توکن به توکن، انجام تراکنش تأیید (Approve) قبل از تعامل نهایی الزامی است."
                    : "Swapping ERC20 requires an Approve transaction to let the router contract trade your tokens."}
                </span>
              </div>
            )}
          </div>

          {/* Live dynamic transaction logs inside a neat warning element */}
          {swapStatusText && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] text-emerald-300 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-450 flex-shrink-0 animate-pulse" />
              <span className="font-sans font-medium">{swapStatusText}</span>
            </div>
          )}

          {/* Transaction Hashes output block */}
          {(approveTxHash || swapTxHash) && (
            <div className="space-y-2">
              {approveTxHash && (
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/10 text-[10px] flex flex-col gap-0.5 text-emerald-305 text-emerald-300">
                  <span className="font-bold text-[9px] text-slate-500 font-mono">APPROVE TX HASH:</span>
                  <a
                    href={`${explorerUrl}tx/${approveTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-mono text-[10px] truncate flex items-center gap-1 hover:text-emerald-250 hover:text-emerald-200"
                  >
                    <span>{approveTxHash}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}

              {swapTxHash && (
                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/10 text-[10px] flex flex-col gap-0.5 text-emerald-305 text-emerald-300">
                  <span className="font-bold text-[9px] text-slate-500 font-mono">SWAP TX HASH:</span>
                  <a
                    href={`${explorerUrl}tx/${swapTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-mono text-[10px] truncate flex items-center gap-1 hover:text-emerald-250 hover:text-emerald-200"
                  >
                    <span>{swapTxHash}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* CTAs Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {swapType === "tokens_to_tokens" && (
              <button
                type="button"
                onClick={triggerApproveForSwap}
                disabled={approveTxMining || !walletConnected}
                className="bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-inner"
              >
                {approveTxMining ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-450" />
                )}
                {language === "fa" ? "۱. تأیید پرداخت" : "1. Approve Token"}
              </button>
            )}

            <button
              type="submit"
              disabled={swapTxMining || !walletConnected}
              className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                swapType === "tokens_to_tokens"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-55 text-slate-950 shadow-emerald-500/10"
                  : "col-span-1 md:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-55 text-slate-950 shadow-emerald-500/10"
              }`}
            >
              {swapTxMining ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <ArrowLeftRight className="w-4 h-4 text-slate-900" />
              )}
              {!walletConnected
                ? (language === "fa" ? "اتصال کیف پول متامسک" : "Connect MetaMask")
                : swapType === "tokens_to_tokens"
                  ? (language === "fa" ? "۲. انجام نهایی مبادله" : "2. Complete Swap")
                  : (language === "fa" ? "انجام نهایی مبادله (Swap)" : "Execute Instant Swap")}
            </button>
          </div>
        </form>
      </div>

      {/* Screen 2: Absolute Laid-over Token Selector Modal */}
      {isSelectingFor && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-6 flex flex-col rounded-3xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" 
                ? `انتخاب توکن (${isSelectingFor === "in" ? "پرداختی" : "دریافتی"})`
                : `Select a Token (${isSelectingFor === "in" ? "Pay" : "Receive"})`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsSelectingFor(null);
                setSearchQuery("");
              }}
              className="text-slate-400 hover:text-slate-205 p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 transition text-xs font-bold font-sans cursor-pointer flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "fa" ? "بستن" : "Close"}</span>
            </button>
          </div>

          {/* Search Input bar */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={language === "fa" ? "جستجوی نام، نماد یا آدرس..." : "Search name, symbol, or address..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 font-sans focus:border-emerald-500 outline-none transition"
              autoFocus
            />
          </div>

          {/* Shortcut Pills for ultra popular options */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {presetTokens.slice(0, 4).map(tk => (
              <button
                key={tk.symbol}
                type="button"
                onClick={() => selectToken(tk)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer text-slate-200"
              >
                <span>{tk.logo}</span>
                <span>{tk.symbol}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-900/80 my-1" />

          {/* Scrollable list of options */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin mt-2 max-h-[200px] md:max-h-[220px]">
            {filteredTokens.length === 0 && !isValidAddress(searchQuery) && (
              <div className="text-center py-8 text-xs text-slate-500">
                {language === "fa" ? "امکان یافتن توکن در این جستجو ممکن نیست" : "No match found for this search string"}
              </div>
            )}

            {filteredTokens.map((tk) => {
              const isSelected = isSelectingFor === "in"
                ? (swapType === "eth_to_tokens" ? tk.address === "native" : tk.address.toLowerCase() === swapTokenIn.toLowerCase())
                : (tk.address.toLowerCase() === swapTokenOut.toLowerCase());

              return (
                <button
                  key={`${tk.address}-${tk.symbol}`}
                  type="button"
                  onClick={() => selectToken(tk)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition duration-150 border cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-slate-900/40 border-transparent hover:bg-slate-900 text-slate-350 hover:text-slate-100 hover:border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 h-7 bg-slate-950/80 rounded-lg flex items-center justify-center border border-slate-850">
                      {tk.logo}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-mono tracking-tight">{tk.symbol}</span>
                        {isSelected && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-sans px-1 rounded-md font-bold">Selected</span>}
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1 font-sans">{tk.name}</span>
                    </div>
                  </div>
                  {tk.address !== "native" && (
                    <span className="text-[9px] text-slate-605 font-mono inline truncate max-w-[80px]">
                      {tk.address.slice(0, 6)}...{tk.address.slice(-4)}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dynamic Add custom manual ERC20 Token via inputs address detector! */}
            {isValidAddress(searchQuery) && !availableTokens.some(t => t.address.toLowerCase() === searchQuery.trim().toLowerCase()) && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-dashed border-emerald-500/20 mt-2">
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2 font-sans">
                  {language === "fa"
                    ? "آدرس قرارداد هوشمند توکن معتبری شناسایی شد! آیا مایلید این توکن را به فرانت‌اند خود الصاق و انتخاب کنید؟"
                    : "Valid smart contract signature detected! Push this ERC20 token to your exchange suite?"}
                </p>
                <div className="font-mono text-[9px] text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-900 truncate select-all mb-3">
                  {searchQuery}
                </div>
                <button
                  type="button"
                  onClick={() => addCustomTokenFromSearch(searchQuery)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{language === "fa" ? "ایمپورت و انتخاب توکن جدید" : "Import & Select Custom Token"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
