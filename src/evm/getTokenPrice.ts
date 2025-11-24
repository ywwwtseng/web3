import { NETWORKS } from '../constants';

export async function getTokenPrice(network: string, address: string) {
  let usdPrice: string | null = null;
  try {
    if (network === NETWORKS.ETHEREUM) {
      // 以太鏈使用 CoinGecko API
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
      );
      const data = await res.json();
      const tokenData = data[address.toLowerCase()];
      if (tokenData && tokenData.usd) {
        usdPrice = tokenData.usd.toString();
      }
    } else if (network === NETWORKS.BSC) {
      // BSC 等其他鏈使用 DexScreener
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${address}`
      );
      const data = await res.json();

      if (data.pairs && data.pairs.length > 0) {
        // 取 TVL 最大的交易對（通常最準確）
        const mainPair = data.pairs.sort(
          (a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
        )[0];

        usdPrice = mainPair.priceUsd ?? null;
      }
    }
  } catch (error) {
    console.error('Price API error:', error);
  }

  return usdPrice;
}
