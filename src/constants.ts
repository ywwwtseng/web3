export const RPC_URL = {
  BSC: 'https://bsc-dataseed.binance.org',
  BSC_TESTNET: 'https://bsc-testnet.publicnode.com',
  SOLANA_DEV: 'https://api.devnet.solana.com',
  SOLANA_MAIN: 'https://api.mainnet-beta.solana.com',
  ETHEREUM_MAINNET: (key: string) => `https://mainnet.infura.io/v3/${key}`,
  SEPOLIA_TESTNET: (key: string) => `https://sepolia.infura.io/v3/${key}`,
};

export const NETWORKS = {
  SOLANA: 'solana',
  BSC: 'bsc',
  ETHEREUM: 'ethereum',
  TON: 'ton',
  TRON: 'tron',
  BTC: 'bitcoin',
};

export const CONFIRMATIONS = {
  [NETWORKS.SOLANA]: 0,
  [NETWORKS.BSC]: 20,
  [NETWORKS.ETHEREUM]: 12,
  [NETWORKS.TON]: 0,
  [NETWORKS.TRON]: 20,
  [NETWORKS.BTC]: 6,
};

// import { ethers } from "ethers";

// const provider = new ethers.JsonRpcProvider(RPC_URL);

// const tx = await provider.getTransaction(txHash);
// const receipt = await provider.getTransactionReceipt(txHash);

// const currentBlock = await provider.getBlockNumber();

// const confirmations = currentBlock - receipt.blockNumber + 1;

// if (confirmations >= 12) {
//   console.log("Safe to credit user");
// }

export const BLOCK_TIME_MS = {
  SOLANA: 400,
  BSC: 750,
  ETH: 12000,
  TON: 5000,
  TRON: 3000,
  BTC: 600000,
};

export const NATIVE_TOKEN_POOL_PAIRS = {
  SOLANA: 'SOLUSDT',
  BSC: 'BNBUSDT',
  ETH: 'ETHUSDT',
  TON: 'TONUSDT',
  TRON: 'TRXUSDT',
  BTC: 'BTCUSDT',
};
