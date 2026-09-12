/**
 * TeQoin Testnet (Chain ID: 420377) Official & Verified Token Configuration
 *
 * Centralized token registry for the TeQoin DEX suite.
 * Replaces fake Ethereum mainnet addresses with real on-chain contracts verified on TeQoin testnet.
 */

export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  isNative?: boolean;
  isStable?: boolean;
}

export const TEQOIN_TOKENS: Record<"ETH" | "WETH" | "TEST" | "USDT" | "USDC" | "DAI" | "TEQ", TokenConfig> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum (Native Gas)",
    address: "native",
    decimals: 18,
    logo: "💎",
    isNative: true,
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether (TeQoin Router WETH)",
    // On-chain Router (0x64c0481600d7C77fA113011Fc3d854b68766C311) uses this exact address:
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    logo: "🌀",
  },
  TEST: {
    symbol: "TEST",
    name: "Teqoin Test Token",
    // Token0 of the only existing liquidity pool (0x8ce3E8be6E69AafB5d336334448546B429227a54)
    address: "0x6cC35D27dEc15F8adeC439cD969989B0b03D5979",
    decimals: 18,
    logo: "🧪",
  },
  USDT: {
    symbol: "USDT",
    name: "TeQoin Wrapped USDT (tqUSDT)",
    address: "0xfcc025A3E170DF62de0e25AF7CeAf1C89aBfe6E9",
    decimals: 6,
    logo: "💵",
    isStable: true,
  },
  USDC: {
    symbol: "USDC",
    name: "TeQoin Wrapped USDC (tqUSDC)",
    address: "0xe819EB5be34B20f1FEC012c0DAf960397A0Fb386",
    decimals: 6,
    logo: "🪙",
    isStable: true,
  },
  DAI: {
    symbol: "DAI",
    name: "TeQoin Wrapped DAI (tqDAI)",
    address: "0xB96A869c74Be2eD561D95a77408505371F287d16",
    decimals: 18,
    logo: "🟡",
    isStable: true,
  },
  TEQ: {
    symbol: "TEQ",
    name: "TeQoin Native Token",
    address: "0x5E3A9432a2D6eb0c5D362A0A2F58Bc02Db45850D",
    decimals: 18,
    logo: "⚡",
  },
};

/**
 * Default selected tokens for swap and liquidity pairing.
 * Matches the ONLY deployed pool on the Factory (0x16A8861a12E3135e8Db32b4198d90c6100f28737):
 * Pair #0: TEST (0x6cC35D27dEc15F8adeC439cD969989B0b03D5979) <-> WETH (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
 */
export const DEFAULT_TOKEN_0 = TEQOIN_TOKENS.TEST;
export const DEFAULT_TOKEN_1 = TEQOIN_TOKENS.WETH;
export const DEFAULT_WETH = TEQOIN_TOKENS.WETH;

export const TEQOIN_TOKEN_LIST: TokenConfig[] = [
  TEQOIN_TOKENS.ETH,
  TEQOIN_TOKENS.WETH,
  TEQOIN_TOKENS.TEST,
  TEQOIN_TOKENS.USDT,
  TEQOIN_TOKENS.USDC,
  TEQOIN_TOKENS.DAI,
  TEQOIN_TOKENS.TEQ,
];

/**
 * Finds a known token config by case-insensitive address or 'native'.
 */
export function findTokenByAddress(address: string): TokenConfig | undefined {
  if (!address) return undefined;
  const clean = address.trim().toLowerCase();
  return TEQOIN_TOKEN_LIST.find((t) => t.address.toLowerCase() === clean);
}

/**
 * Resolves a token for UI display with a graceful fallback for custom addresses.
 */
export function getTokenDisplay(address: string, fallbackSymbol?: string): TokenConfig {
  const found = findTokenByAddress(address);
  if (found) return found;

  const shortAddr = address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  return {
    symbol: fallbackSymbol || (address === "native" ? "ETH" : "CUSTOM"),
    name: `Custom Token (${shortAddr})`,
    address,
    decimals: 18,
    logo: "🪄",
  };
}
