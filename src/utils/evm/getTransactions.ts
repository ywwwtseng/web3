

import { NETWORKS } from '../../constants';
import { hex } from '../units';
/**
 * 交易传输信息
 */
export interface TransactionTransfer {
  /** 交易 ID */
  id: number;
  /**
   * 交易类别
   * - 'external': 外部交易，即普通账户之间的原生代币（ETH/BNB）转账
   * - 'internal': 内部交易，即合约调用产生的交易
   * - '20': ERC-20 代币转账（同质化代币，如 USDT、USDC）
   * - '721': ERC-721 NFT 转账（非同质化代币，每个代币都是唯一的）
   * - '1155': ERC-1155 多代币标准转账（可以同时处理同质化和非同质化代币）
   */
  category: 'external' | 'internal' | '20' | '721' | '1155';
  /** 区块号（十六进制） */
  blockNum: string;
  /** 发送方地址 */
  from: string;
  /** 接收方地址 */
  to: string;
  /** 转账金额（十六进制） */
  value: string;
  /** 资产名称 */
  asset: string;
  /** 名称 */
  name: string;
  /** 交易哈希 */
  hash: string;
  /** 合约地址（原生代币为全0地址） */
  contractAddress: string;
  /** 区块时间戳 */
  blockTimeStamp: number;
  /** 区块混合哈希 */
  blockMixHash: string;
  /** Gas 价格 */
  gasPrice: number;
  /** 使用的 Gas */
  gasUsed: number;
  /** 交易状态（1=成功，0=失败） */
  receiptsStatus: number;
  /** Gas 限制 */
  gas: number;
  /** 交易输入数据 */
  input: string;
  /** 日志索引 */
  logIndex: number;
  /** 追踪索引 */
  traceIndex: number;
  /** L1 费用（Layer 2 相关） */
  l1Fee: string;
  /** L1 费用标量（Layer 2 相关） */
  l1FeeScalar: string;
  /** L1 Gas 价格（Layer 2 相关） */
  l1GasPrice: string;
  /** L1 使用的 Gas（Layer 2 相关） */
  l1GasUsed: string;
  /** 交易类型（十六进制） */
  txType: string;
}

/**
 * 交易查询结果
 */
export interface TransactionResult {
  /** 分页键，用于获取下一页数据 */
  pageKey: string;
  /** 交易传输列表 */
  transfers: TransactionTransfer[];
}

/**
 * JSON-RPC 响应格式
 */
export interface GetTransactionsResponse {
  /** JSON-RPC 版本 */
  jsonrpc: '2.0';
  /** 请求 ID */
  id: number;
  /** 查询结果 */
  result: TransactionResult;
}

export async function getTransactions({
  noderealApiKey,
  address,
  network,
  category = ['external', '20'],
  maxCount = 20,
}: {
  network: string;
  noderealApiKey: string;
  address: string;
  category?: ('external' | 'internal' | '20' | '721' | '1155')[];
  maxCount?: number;
}) {
  let url: string;
  if (network === NETWORKS.BSC) {
    url = `https://bsc-mainnet.nodereal.io/v1/${noderealApiKey}`;
  } else if (network === NETWORKS.ETHEREUM) {
    url = `https://eth-mainnet.nodereal.io/v1/${noderealApiKey}`;
  } else {
    throw new Error(`Network ${network} not supported`);
  }

  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'nr_getTransactionByAddress',
    params: [
      {
        category,
        address,
        order: 'desc',
        maxCount: hex(maxCount),
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const data: GetTransactionsResponse = await res.json();
  return data.result;
}