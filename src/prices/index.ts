import { InMemoryCache } from '@ywwwtseng/ywjs';
import BigNumber from 'bignumber.js';
import { NETWORKS } from '../constants';

const COINGECKO_NETWORK_MAP = {
  [NETWORKS.ETHEREUM]: 'ethereum',
  [NETWORKS.BSC]: 'binance-smart-chain',
  [NETWORKS.TON]: 'the-open-network',
  [NETWORKS.SOLANA]: 'solana',
  [NETWORKS.TRON]: 'tron',
  [NETWORKS.BTC]: 'bitcoin',
};

const COINGECKO_NATIVE_COIN_MAP = {
  [NETWORKS.ETHEREUM]: 'ethereum',        // ETH
  [NETWORKS.BSC]: 'binancecoin',          // BNB
  [NETWORKS.TON]: 'the-open-network',     // TON
  [NETWORKS.SOLANA]: 'solana',            // SOL
  [NETWORKS.TRON]: 'tron',                // TRX
  [NETWORKS.BTC]: 'bitcoin',              // BTC
};

class Prices extends InMemoryCache {
  async fetch({
    network,
    tokenAddress,
  }: {
    network: string;
    tokenAddress?: string | null;
  }): Promise<string> {
    try {
      if (!tokenAddress) {
        const nativeCoin = COINGECKO_NATIVE_COIN_MAP[network];
        if (!nativeCoin) {
          throw new Error(`Native coin for network ${network} not found`);
        }
  
        const cachedPrice = this.get<string>(nativeCoin);
        if (cachedPrice) {
          return cachedPrice;
        }
    
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,the-open-network,ethereum,solana,tron,bitcoin&vs_currencies=usd`);
        const data = await res.json();
  
        for (const key in data) {
          this.set(key, new BigNumber(data[key].usd).toFixed(), 5 * 60 * 1000); // 5 minutes
        }
  
        return this.get(nativeCoin);
      } else {
        if (!COINGECKO_NETWORK_MAP[network]) {
          throw new Error(`Network ${network} not supported`);
        }
  
        const cacheKey = JSON.stringify({ network, tokenAddress });
  
        const cachedPrice = this.get<string>(cacheKey);
        if (cachedPrice) {
          return cachedPrice;
        }
    
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${COINGECKO_NETWORK_MAP[network]}?contract_addresses=${tokenAddress}&vs_currencies=usd`);
        const data = await res.json() as { [key: string]: { usd: number } };
        const usdPrice = Object.values(data)[0]?.usd;
  
        if (!usdPrice) {
          throw new Error(`USD price for token ${tokenAddress} not found`);
        }
  
        this.set(cacheKey, new BigNumber(usdPrice).toFixed(), 5 * 60 * 1000); // 5 minutes
        return this.get<string>(cacheKey);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const prices = new Prices();