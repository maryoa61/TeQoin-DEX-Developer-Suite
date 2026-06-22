import React, { FormEvent } from "react";
import { ArrowLeftRight, Check, RefreshCw, Info, ArrowUpRight, HelpCircle } from "lucide-react";
import { SwapTabProps } from "../types";

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
  swapTxMining,
  approveTxMining,
  swapTxHash,
  approveTxHash,
  swapStatusText,
  triggerApproveForSwap,
  triggerExecuteSwap,
}: SwapTabProps) {
  return (
    <div className="max-w-md w-full mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative subtle header line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 opacity-80" />

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
          onClick={() => setSwapType("eth_to_tokens")}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition duration-150 ${
            swapType === "eth_to_tokens"
              ? "bg-slate-800 text-emerald-400 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
          type="button"
        >
          {language === "fa" ? `کوین بومی (${currentSymbol})` : `Native ${currentSymbol}`}
        </button>
        <button
          onClick={() => setSwapType("tokens_to_tokens")}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition duration-150 ${
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
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
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
            <span className="bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 font-mono">
              {swapType === "eth_to_tokens" ? currentSymbol : "TOKEN A"}
            </span>
          </div>
        </div>

        {/* Minimal Middle arrow */}
        <div className="flex justify-center -my-3.5 relative z-10">
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/20 p-2 rounded-xl text-emerald-400 shadow-md cursor-pointer transition">
            <ArrowLeftRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Receive Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
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
            <span className="bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 font-mono">
              TOKEN B
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            {language === "fa" ? "محاسبه بر اساس بدترین نرخ لغزش استخر" : "Calculated with slippage threshold limits."}
          </p>
        </div>

        {/* ERC20 specific setup inputs */}
        {swapType === "tokens_to_tokens" ? (
          <div className="space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/80">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">TOKEN IN (ERC20) ADDRESS:</label>
                <button
                  type="button"
                  onClick={() => setSwapTokenIn(token0Address)}
                  className="text-[9px] text-emerald-400 hover:underline font-bold"
                >
                  {language === "fa" ? "توکن آزمایشی ۰" : "Use Token 0"}
                </button>
              </div>
              <input
                type="text"
                value={swapTokenIn}
                onChange={(e) => setSwapTokenIn(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">TOKEN OUT (ERC20) ADDRESS:</label>
                <button
                  type="button"
                  onClick={() => setSwapTokenOut(token1Address)}
                  className="text-[9px] text-emerald-400 hover:underline font-bold"
                >
                  {language === "fa" ? "توکن آزمایشی ۱" : "Use Token 1"}
                </button>
              </div>
              <input
                type="text"
                value={swapTokenOut}
                onChange={(e) => setSwapTokenOut(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div className="bg-teal-500/5 text-emerald-300 text-[10px] p-3 rounded-xl border border-emerald-500/10 leading-relaxed flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>
                {language === "fa"
                  ? "جهت مبادله توکن به توکن، انجام ۱ تراکنش Approve برای صدور اجازه دسترسی Router الزامیست."
                  : "Swapping ERC20 requires an Approve transaction to let the router contract trade your tokens."}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/80">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">SWAP OUTPUT TARGET TOKEN ADDRESS:</label>
                <button
                  type="button"
                  onClick={() => setSwapTokenOut(token1Address)}
                  className="text-[9px] text-emerald-400 hover:underline font-bold"
                >
                  {language === "fa" ? "توکن آزمایشی ۱" : "Use Token 1"}
                </button>
              </div>
              <input
                type="text"
                value={swapTokenOut}
                onChange={(e) => setSwapTokenOut(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* Live dynamic transaction logs inside a neat warning element */}
        {swapStatusText && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] text-emerald-300 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="font-sans font-medium">{swapStatusText}</span>
          </div>
        )}

        {/* Transaction Hashes output block */}
        {(approveTxHash || swapTxHash) && (
          <div className="space-y-2">
            {approveTxHash && (
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/10 text-[10px] flex flex-col gap-0.5 text-emerald-300">
                <span className="font-bold text-[9px] text-slate-500 font-mono">APPROVE TX HASH:</span>
                <a
                  href={`${explorerUrl}tx/${approveTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-mono text-[10px] truncate flex items-center gap-1 hover:text-emerald-200"
                >
                  <span>{approveTxHash}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            )}

            {swapTxHash && (
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/10 text-[10px] flex flex-col gap-0.5 text-emerald-300">
                <span className="font-bold text-[9px] text-slate-500 font-mono">SWAP TX HASH:</span>
                <a
                  href={`${explorerUrl}tx/${swapTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-mono text-[10px] truncate flex items-center gap-1 hover:text-emerald-200"
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
              className="bg-slate-800 hover:bg-slate-705 disabled:opacity-50 text-emerald-405 border border-emerald-500/20 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-inner cursor-pointer"
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
  );
}
