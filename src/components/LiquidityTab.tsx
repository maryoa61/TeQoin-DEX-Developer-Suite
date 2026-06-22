import React, { FormEvent } from "react";
import { ArrowUpRight, Plus, RefreshCw, TrendingUp, Wallet, Info, ArrowLeftRight } from "lucide-react";
import { LiquidityTabProps } from "../types";

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
}: LiquidityTabProps) {
  return (
    <div className="max-w-xl w-full mx-auto flex flex-col gap-6">
      
      {/* Block 1: Create Pool Pair (Uniswap setup) */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 opacity-80" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
              {language === "fa" ? "مرحله ۱: ایجاد استخر جفت معاملاتی" : "Create New Liquidity Pool"}
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-950 text-indigo-450 border border-indigo-500/10 px-2 py-0.5 rounded-md">
            WRITE_FACTORY
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          {language === "fa"
            ? "آدرس دو توکن انتخابی را برای تأمین لایه نقدینگی وارد کنید تا قرارداد جفت استخر به صورت اتوماتیک در بلاکچین TaQoin دیپلوی گردد."
            : "Deploy a new liquidity pool pair on the factory contract securely using your connected MetaMask wallet."}
        </p>

        <form onSubmit={triggerCreatePairOnChain} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">TOKEN A ADDRESS:</label>
              <input
                type="text"
                placeholder="0x..."
                value={pairTokenA}
                onChange={(e) => setPairTokenA(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-indigo-505 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">TOKEN B ADDRESS:</label>
              <input
                type="text"
                placeholder="0x..."
                value={pairTokenB}
                onChange={(e) => setPairTokenB(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-indigo-505 outline-none"
                required
              />
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
              {language === "fa" ? "مرحله ۲: استعلام نقدینگی و ذخایر استخر" : "Query Pool Live Reserves"}
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
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-0.5">RESERVE 0 (A):</span>
              <span className="text-sm font-mono font-bold text-slate-250">
                {reserve0Result ? parseFloat(reserve0Result).toFixed(4) : "—"}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block mb-0.5">RESERVE 1 (B):</span>
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
