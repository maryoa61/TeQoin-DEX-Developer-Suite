import React from "react";
import { Activity, Globe, Wallet, Settings } from "lucide-react";
import { NavbarProps } from "../types";

export function Navbar({
  language,
  setLanguage,
  walletConnected,
  userAddress,
  userBalance,
  currentSymbol,
  walletLoading,
  connectWallet,
  showAdmin,
  setShowAdmin,
  dexTab,
  setDexTab,
}: NavbarProps) {
  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-100 font-sans">
              {language === "fa" ? "مبادله غیرمتمرکز TeQoin" : "TeQoin DEX Swap"}
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold">
              EST. 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {language === "fa"
              ? "پلتفرم معاملاتی و تأمین نقدینگی شبکه آزمایشی TaQoin"
              : "AMM trading & liquidity platform on TaQoin Testnet"}
          </p>
        </div>
      </div>

      {/* Main navigation links like Uniswap */}
      <nav className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setDexTab("swap")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            dexTab === "swap"
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/10 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {language === "fa" ? "تبادل (Swap)" : "Swap"}
        </button>
        <button
          onClick={() => setDexTab("liquidity")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            dexTab === "liquidity"
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/10 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {language === "fa" ? "افزودن نقدینگی" : "Add Liquidity"}
        </button>
      </nav>

      {/* Global Controls & Connect Status */}
      <div className="flex items-center gap-3">
        {/* Toggle Admin Section Button */}
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 rounded-xl border transition duration-150 ${
            showAdmin
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/5 animate-pulse"
              : "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
          title={language === "fa" ? "بخش پیشرفته مدیریت / توسعه‌دهنده" : "Technical & Admin Settings"}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{language === "fa" ? "پنل مدیریت" : "Admin Panel"}</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage((l) => (l === "fa" ? "en" : "fa"))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition duration-150"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-500" />
          {language === "fa" ? "EN" : "فارسی"}
        </button>

        <span className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Wallet connection block */}
        {walletConnected ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-405 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 font-sans shadow-lg shadow-emerald-500/10 transition-all duration-150"
          >
            <Wallet className="w-4 h-4" />
            {walletLoading ? (
              <span>Connecting...</span>
            ) : language === "fa" ? (
              "اتصال کیف پول"
            ) : (
              "Connect Wallet"
            )}
          </button>
        )}
      </div>
    </header>
  );
}
