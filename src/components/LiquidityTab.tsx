import React, { FormEvent } from "react";
import { ArrowUpRight, Plus, RefreshCw, TrendingUp, Wallet, Info, ArrowLeftRight, Check, Layers, AlertCircle } from "lucide-react";
import { LiquidityTabProps } from "../types";
import { TEQOIN_TOKENS, TEQOIN_TOKEN_LIST, getTokenDisplay } from "../tokens.config";

export function LiquidityTab({
  language,
  walletConnected,
  explorerUrl,
  queryLoading,
  pairAddressResult,
  reserve0Result,
  reserve1Result,
  poolStatusText,
  queryOnChainPair,
  pairTokenA,
  setPairTokenA,
  pairTokenB,
  setPairTokenB,
  txMining,
  txHashResult,
  triggerCreatePairOnChain,
  factoryAddress,
  allPairsList = [],
  loadingPairs = false,
  refreshAllPairs,
  onSelectExistingPair,
}: LiquidityTabProps) {
  // Real token labels for the entered addresses
  const tokenAInfo = getTokenDisplay(pairTokenA, "TOKEN-A");
  const tokenBInfo = getTokenDisplay(pairTokenB, "TOKEN-B");

  // Selectable list of tokens for quick pairing (TEST, USDT, USDC, DAI, TEQ, WETH)
  const selectableTokens = TEQOIN_TOKEN_LIST.filter(t => !t.isNative);

  return (
    <div className="max-w-xl w-full mx-auto flex flex-col gap-6">

      {/* Block 0: On-Chain Factory Pools Registry (Explaining existing pool(s)) */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-indigo-900/50 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-90" />

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" ? "فهرست مخازن فعال در فکتوری" : "Factory Pools Registry"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
              {language === "fa"
                ? `کل مخازن: ${allPairsList.length}`
                : `Total: ${allPairsList.length}`}
            </span>
            {refreshAllPairs && (
              <button
                type="button"
                onClick={refreshAllPairs}
                disabled={loadingPairs}
                title={language === "fa" ? "بروزرسانی مخازن فکتوری" : "Refresh pools"}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPairs ? "animate-spin text-indigo-400" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Informative Note for Single Pool situation */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-300 mb-0.5">
              {language === "fa" ? "وضعیت زنده استخرهای شبکه تیکوین:" : "Live TeQoin Factory Status:"}
            </span>
            {language === "fa"
              ? "دقیقاً همین‌طور است! بر روی قرارداد فکتوری فعلی در حال حاضر فقط یک مخزن (جفت شماره ۰ یعنی TEST/WETH) ثبت شده است. اگر مایلید برای سایر توکن‌ها (مانند USDT یا USDC یا DAI) نیز مخزن داشته باشید، می‌توانید از بخش پایین با یک کلیک استخر جدید بسازید."
              : "Indeed! Currently only 1 pool (Pair #0: TEST/WETH) exists on the on-chain Factory contract. To trade or provide liquidity for other tokens (like USDT, USDC, or DAI), you can deploy a new pair below."}
          </div>
        </div>

        {/* Existing Pools List */}
        <div className="space-y-2.5">
          {allPairsList.length === 0 && !loadingPairs && (
            <div className="text-center py-4 text-xs text-slate-400">
              {language === "fa" ? "هیچ مخزنی یافت نشد." : "No pools found."}
            </div>
          )}

          {allPairsList.map((pair) => {
            const isCurrentSelected =
              (pairTokenA.toLowerCase() === pair.token0.toLowerCase() && pairTokenB.toLowerCase() === pair.token1.toLowerCase()) ||
              (pairTokenA.toLowerCase() === pair.token1.toLowerCase() && pairTokenB.toLowerCase() === pair.token0.toLowerCase());

            return (
              <div
                key={`pool-card-${pair.pairAddress}`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrentSelected
                    ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      #{pair.index}
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100">
                      <span>{pair.token0Logo}</span>
                      <span>{pair.token0Symbol}</span>
                      <span className="text-slate-600">/</span>
                      <span>{pair.token1Logo}</span>
                      <span>{pair.token1Symbol}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`${explorerUrl}address/${pair.pairAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline"
                    >
                      <span className="hidden sm:inline">{pair.pairAddress.slice(0, 6)}...{pair.pairAddress.slice(-4)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    {onSelectExistingPair && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectExistingPair(pair.token0, pair.token1);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-sans transition cursor-pointer ${
                          isCurrentSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {isCurrentSelected
                          ? (language === "fa" ? "انتخاب‌شده ✓" : "Selected ✓")
                          : (language === "fa" ? "انتخاب این مخزن" : "Select Pool")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                  <div className="truncate">
                    <span className="text-slate-500">ذخیره {pair.token0Symbol}: </span>
                    <span className="text-slate-300 font-bold">{parseFloat(pair.reserve0).toFixed(4)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">ذخیره {pair.token1Symbol}: </span>
                    <span className="text-slate-300 font-bold">{parseFloat(pair.reserve1).toFixed(4)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Block 1: Create Pool Pair (Uniswap setup) */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 opacity-80" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" ? "ایجاد مخزن نقدینگی جدید (Create Pair)" : "Create New Liquidity Pool"}
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-950 text-indigo-450 border border-indigo-500/10 px-2 py-0.5 rounded-md">
            WRITE_FACTORY
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          {language === "fa"
            ? "برای ایجاد مخزن دوم یا سایر جفت‌ها، دو توکن موردنظر (مانند USDT و USDC) را انتخاب کرده و دکمه ایجاد را بزنید:"
            : "Deploy a new liquidity pool pair on the factory contract securely using verified TeQoin testnet tokens or your custom tokens."}
        </p>

        <form onSubmit={triggerCreatePairOnChain} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Token A Input & Badge */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  TOKEN A ({tokenAInfo.symbol}):
                </label>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <span>{tokenAInfo.logo}</span>
                  <span>{tokenAInfo.symbol}</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="0x..."
                value={pairTokenA}
                onChange={(e) => setPairTokenA(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-indigo-500 outline-none"
                required
              />

              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-sans">
                <span className="text-slate-500">{language === "fa" ? "نام توکن:" : "Name:"}</span>
                <span className="text-slate-300 font-semibold">{tokenAInfo.name}</span>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900">
                {selectableTokens.map((tk) => (
                  <button
                    key={`tokenA-${tk.symbol}`}
                    type="button"
                    onClick={() => setPairTokenA(tk.address)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border transition cursor-pointer ${
                      pairTokenA.toLowerCase() === tk.address.toLowerCase()
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span>{tk.logo}</span>
                    <span>{tk.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Token B Input & Badge */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  TOKEN B ({tokenBInfo.symbol}):
                </label>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  <span>{tokenBInfo.logo}</span>
                  <span>{tokenBInfo.symbol}</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="0x..."
                value={pairTokenB}
                onChange={(e) => setPairTokenB(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-pink-500 outline-none"
                required
              />

              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-sans">
                <span className="text-slate-500">{language === "fa" ? "نام توکن:" : "Name:"}</span>
                <span className="text-slate-300 font-semibold">{tokenBInfo.name}</span>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900">
                {selectableTokens.map((tk) => (
                  <button
                    key={`tokenB-${tk.symbol}`}
                    type="button"
                    onClick={() => setPairTokenB(tk.address)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border transition cursor-pointer ${
                      pairTokenB.toLowerCase() === tk.address.toLowerCase()
                        ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span>{tk.logo}</span>
                    <span>{tk.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {txHashResult && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-900/40 text-[11px] flex flex-col gap-1 text-indigo-300">
              <span className="font-bold text-[9px] text-slate-500 font-mono">POOL DEPLOYED BROADCAST SUCCESS:</span>
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
            className="w-full bg-gradient-to-r from-indigo-650 to-indigo-550 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-slate-100 py-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            {txMining ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {!walletConnected
              ? (language === "fa" ? "ابتدا کیف پول را متصل کنید" : "Connect Wallet First")
              : (language === "fa" ? "ایجاد توکن استخر جفت در بلاکچین" : "Broadcast createPair Transaction")}
          </button>
        </form>
      </div>

      {/* Block 2: Check Pool Reserves & Read State (Uniswap Live inspection) */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 opacity-80" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" ? "استعلام نقدینگی و ذخایر استخر انتخاب‌شده" : "Query Pool Live Reserves"}
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-md">
            READ_ONLY
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          {language === "fa"
            ? "آدرس جفت ایجاد شده و دقیق‌ترین مقدار ذخایر دارایی‌ها را در همان ثانیه از بلاکچین تستی پایش و فراخوانی کنید:"
            : "Inspect reserves index, liquidity tokens ledger weights, and state directly from the on-chain registry."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-center">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-1">LIVE POOL ADDRESS:</span>
            {pairAddressResult ? (
              <span className="text-xs font-mono tracking-tight text-emerald-400 select-all font-bold">
                {pairAddressResult}
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-mono">—</span>
            )}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-0.5">
                RESERVE 0 ({tokenAInfo.symbol}):
              </span>
              <span className="text-sm font-mono font-bold text-slate-250">
                {reserve0Result ? parseFloat(reserve0Result).toFixed(4) : "—"}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-0.5">
                RESERVE 1 ({tokenBInfo.symbol}):
              </span>
              <span className="text-sm font-mono font-bold text-slate-250">
                {reserve1Result ? parseFloat(reserve1Result).toFixed(4) : "—"}
              </span>
            </div>
          </div>
        </div>

        {poolStatusText && (
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-xs text-emerald-300 flex items-center gap-2 mb-4">
            <Info className="w-3.5 h-3.5 text-emerald-450 flex-shrink-0" />
            <span className="font-sans font-medium">{poolStatusText}</span>
          </div>
        )}

        <button
          onClick={queryOnChainPair}
          disabled={queryLoading}
          className="w-full bg-slate-850 hover:bg-slate-800 disabled:opacity-50 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {queryLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          )}
          {language === "fa" ? "فراخوانی انبار ذخایر بلاکچین" : "Fetch Reserves from Blockchain"}
        </button>
      </div>

    </div>
  );
}
