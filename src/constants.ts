export const RPC_URL = {
  BSC: 'https://bsc-dataseed.binance.org',
  SOLANA_DEV: 'https://api.devnet.solana.com',
  SOLANA_MAIN: 'https://api.mainnet-beta.solana.com',
  ETHEREUM_MAINNET: (key: string) => `https://mainnet.infura.io/v3/${key}`,
};

export const NETWORKS = {
  SOLANA: 'solana',
  BSC: 'bsc',
  ETHEREUM: 'ethereum',
  TON: 'ton',
  TRON: 'tron',
  BTC: 'bitcoin',
};

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

export const JETTON_TRANSFER_OP = 0x0f8a7ea5; // transfer
export const JETTON_TRANSFER_NOTIFICATION_OP = 0x7362d09c; // transfer_notification
