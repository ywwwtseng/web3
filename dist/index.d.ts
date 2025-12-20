import * as _solana_web3_js from '@solana/web3.js';
import { Keypair, Connection, SignaturesForAddressOptions, PublicKey, Transaction, ParsedTransactionWithMeta } from '@solana/web3.js';
export { _solana_web3_js as solana };
import { TransactionReceipt, JsonRpcProvider, Wallet } from 'ethers';
import * as ethers from 'ethers';
export { ethers };
import { Transaction as Transaction$1, TonClient, OpenedContract, WalletContractV5R1 } from '@ton/ton';
import * as ton from '@ton/ton';
export { ton };
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import * as _ton_core from '@ton/core';
import TonWeb from 'tonweb';

declare function formatUnits(value: string | bigint, decimals: number): string;
declare function parseUnits(value: string, decimals: number): bigint;
declare function hex(value: string | number | bigint): string;

declare function loadImage(url: string): Promise<Blob | null>;

declare function getRpcUrl(network: string, options?: {
    infuraApiKey?: string;
}): string;

declare class KeyPair {
    static from(secretKey: string | Uint8Array): Keypair;
    static generate(): Keypair;
}

declare function getSignaturesForAddress(connection: Connection, { address, ata, ...options }: {
    address: string;
    ata?: boolean;
} & SignaturesForAddressOptions): Promise<string[]>;

declare function hasATA(connection: Connection, mintAddress: string | PublicKey, ownerAddress: string | PublicKey, tokenProgram: typeof TOKEN_PROGRAM_ID | typeof TOKEN_2022_PROGRAM_ID): Promise<boolean>;
declare function createATAInstruction(payer: PublicKey, mint: PublicKey, owner: PublicKey, tokenProgram: typeof TOKEN_PROGRAM_ID | typeof TOKEN_2022_PROGRAM_ID): _solana_web3_js.TransactionInstruction;
declare function createSolanaTransaction({ source, destination, amount, }: {
    source: string | PublicKey;
    destination: string | PublicKey;
    amount: bigint | string | number;
}): Promise<Transaction>;
declare function createSPLTransaction(connection: Connection, { feePayer, source, destination, amount, mint, tokenProgram, }: {
    feePayer: string | PublicKey;
    source: string | PublicKey;
    destination: string | PublicKey;
    amount: bigint | string | number;
    mint: string | PublicKey;
    tokenProgram?: string | PublicKey | null;
}): Promise<Transaction>;
interface CreateTransactionParams {
    feePayer: string | PublicKey;
    source: string | PublicKey;
    destination: string | PublicKey;
    amount: bigint | string | number;
    mint?: string | PublicKey | null;
    tokenProgram?: string | PublicKey | null;
}
declare function createTransaction(connection: Connection, { feePayer, source, destination, amount, mint, tokenProgram, }: CreateTransactionParams): Promise<Transaction>;

declare function decodeTransfer(connection: Connection, base64: string): Promise<{
    source: string;
    destination: string;
    amount: string;
    tokenAddress?: string;
}>;

declare function getAccountInfo(connection: Connection, publicKey: string | PublicKey): Promise<{
    owner: string | undefined;
    mint: string | undefined;
}>;

declare function getParsedTransaction({ connection, signature, }: {
    connection: Connection;
    signature: string;
}): Promise<_solana_web3_js.ParsedTransactionWithMeta>;

declare function waitForTransaction$2({ connection, signature, refetchInterval, refetchLimit, }: {
    connection: Connection;
    signature: string;
    refetchInterval?: number;
    refetchLimit?: number;
}): Promise<ParsedTransactionWithMeta | null>;

type Transfer<T = ParsedTransactionWithMeta | TransactionReceipt | Transaction$1> = {
    source: string;
    destination: string;
    amount: string;
    tokenAddress?: string;
    transaction: T;
};

declare function getTransfers({ connection, hash, }: {
    connection: Connection;
    hash: string;
}): Promise<Transfer<ParsedTransactionWithMeta>[]>;

declare function sendTransaction$1({ privateKey, connection, source, destination, token, amount, }: {
    privateKey: string;
    connection: Connection;
    source: string;
    destination: string;
    token?: {
        token_address: string;
        token_program: string;
    };
    amount: string;
}): Promise<string>;

type index$3_CreateTransactionParams = CreateTransactionParams;
type index$3_KeyPair = KeyPair;
declare const index$3_KeyPair: typeof KeyPair;
declare const index$3_createATAInstruction: typeof createATAInstruction;
declare const index$3_createSPLTransaction: typeof createSPLTransaction;
declare const index$3_createSolanaTransaction: typeof createSolanaTransaction;
declare const index$3_createTransaction: typeof createTransaction;
declare const index$3_decodeTransfer: typeof decodeTransfer;
declare const index$3_getAccountInfo: typeof getAccountInfo;
declare const index$3_getParsedTransaction: typeof getParsedTransaction;
declare const index$3_getSignaturesForAddress: typeof getSignaturesForAddress;
declare const index$3_getTransfers: typeof getTransfers;
declare const index$3_hasATA: typeof hasATA;
declare namespace index$3 {
  export { type index$3_CreateTransactionParams as CreateTransactionParams, index$3_KeyPair as KeyPair, index$3_createATAInstruction as createATAInstruction, index$3_createSPLTransaction as createSPLTransaction, index$3_createSolanaTransaction as createSolanaTransaction, index$3_createTransaction as createTransaction, index$3_decodeTransfer as decodeTransfer, index$3_getAccountInfo as getAccountInfo, index$3_getParsedTransaction as getParsedTransaction, index$3_getSignaturesForAddress as getSignaturesForAddress, index$3_getTransfers as getTransfers, index$3_hasATA as hasATA, sendTransaction$1 as sendTransaction, waitForTransaction$2 as waitForTransaction };
}

declare function getJettonWalletAddress({ minterAddress, ownerAddress, client, }: {
    minterAddress: string;
    ownerAddress: string;
    client?: TonClient;
}): Promise<string>;

declare function waitForTransaction$1({ client, hash, refetchInterval, refetchLimit, address, }: {
    client: TonClient;
    hash: string;
    refetchInterval?: number;
    refetchLimit?: number;
    address: string;
}): Promise<Transaction$1 | null>;

declare function getMessageHash(boc: string): string;

declare function createTransferBody({ tokenAmount, toAddress, responseAddress, }: {
    tokenAmount: string;
    toAddress: string;
    responseAddress: string;
}): _ton_core.Cell;

declare function createWalletContractV5R1({ client, privateKey, }: {
    client: TonClient;
    privateKey: string;
}): Promise<{
    address: string;
    contract: OpenedContract<WalletContractV5R1>;
    state: 'active' | 'uninitialized' | 'frozen';
}>;

declare function sendTransaction({ client, minterAddress, privateKey, destination, amount, }: {
    client: TonClient;
    minterAddress?: string;
    privateKey: string;
    destination: string;
    amount: string;
}): Promise<string>;

declare function getTransfer$2({ client, source, hash, }: {
    client: TonClient;
    source: string;
    hash: string;
}): Promise<Transfer | null>;

declare const index$2_createTransferBody: typeof createTransferBody;
declare const index$2_createWalletContractV5R1: typeof createWalletContractV5R1;
declare const index$2_getJettonWalletAddress: typeof getJettonWalletAddress;
declare const index$2_getMessageHash: typeof getMessageHash;
declare const index$2_sendTransaction: typeof sendTransaction;
declare namespace index$2 {
  export { index$2_createTransferBody as createTransferBody, index$2_createWalletContractV5R1 as createWalletContractV5R1, index$2_getJettonWalletAddress as getJettonWalletAddress, index$2_getMessageHash as getMessageHash, getTransfer$2 as getTransfer, index$2_sendTransaction as sendTransaction, waitForTransaction$1 as waitForTransaction };
}

declare function estimateFee({ provider, tokenAddress, signer, destination, amount, }: {
    provider: JsonRpcProvider;
    tokenAddress?: string;
    signer?: Wallet;
    destination?: string;
    amount?: string | bigint;
}): Promise<string>;

declare function waitForTransaction({ provider, hash, refetchInterval, refetchLimit, }: {
    provider: JsonRpcProvider;
    hash: string;
    refetchInterval?: number;
    refetchLimit?: number;
}): Promise<TransactionReceipt | null>;

/**
 * 交易传输信息
 */
interface TransactionTransfer {
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
interface TransactionResult {
    /** 分页键，用于获取下一页数据 */
    pageKey: string;
    /** 交易传输列表 */
    transfers: TransactionTransfer[];
}
/**
 * JSON-RPC 响应格式
 */
interface GetTransactionsResponse {
    /** JSON-RPC 版本 */
    jsonrpc: '2.0';
    /** 请求 ID */
    id: number;
    /** 查询结果 */
    result: TransactionResult;
}
declare function getTransactions({ noderealApiKey, address, network, category, maxCount, }: {
    network: string;
    noderealApiKey: string;
    address: string;
    category?: ('external' | 'internal' | '20' | '721' | '1155')[];
    maxCount?: number;
}): Promise<TransactionResult>;

declare function getTransfer$1({ provider, hash, }: {
    provider: JsonRpcProvider;
    hash: string;
}): Promise<Transfer | null>;

type index$1_GetTransactionsResponse = GetTransactionsResponse;
type index$1_TransactionResult = TransactionResult;
type index$1_TransactionTransfer = TransactionTransfer;
declare const index$1_estimateFee: typeof estimateFee;
declare const index$1_getTransactions: typeof getTransactions;
declare const index$1_waitForTransaction: typeof waitForTransaction;
declare namespace index$1 {
  export { type index$1_GetTransactionsResponse as GetTransactionsResponse, type index$1_TransactionResult as TransactionResult, type index$1_TransactionTransfer as TransactionTransfer, index$1_estimateFee as estimateFee, index$1_getTransactions as getTransactions, getTransfer$1 as getTransfer, index$1_waitForTransaction as waitForTransaction };
}

declare const index_formatUnits: typeof formatUnits;
declare const index_getRpcUrl: typeof getRpcUrl;
declare const index_hex: typeof hex;
declare const index_loadImage: typeof loadImage;
declare const index_parseUnits: typeof parseUnits;
declare namespace index {
  export { index$1 as evm, index_formatUnits as formatUnits, index_getRpcUrl as getRpcUrl, index_hex as hex, index_loadImage as loadImage, index_parseUnits as parseUnits, index$3 as solana, index$2 as ton };
}

declare class AES256GCM {
    private key;
    constructor(key: string | Buffer);
    encrypt(hexPrivateKey: string): string;
    decrypt(encrypted: string): string;
}

declare class KeyVaultService extends AES256GCM {
    get solana(): {
        generate: () => {
            address: string;
            publicKey: _solana_web3_js.PublicKey;
            privateKeyEncrypted: string;
        };
        recover: (encryptedPrivateKey: string) => _solana_web3_js.Keypair;
    };
    get evm(): {
        generate: () => {
            address: string;
            publicKey: string;
            privateKeyEncrypted: string;
        };
        recover: (encryptedPrivateKey: string) => Wallet;
    };
    get ton(): {
        generate: () => Promise<{
            address: _ton_core.Address;
            publicKey: Buffer<ArrayBufferLike>;
            privateKeyEncrypted: string;
        }>;
        recover: (encryptedPrivateKey: string) => {
            address: _ton_core.Address;
            publicKey: Buffer<ArrayBuffer>;
            privateKey: string;
        };
    };
}

declare function getBalance({ network, provider, connection, }: {
    network: string;
    provider?: JsonRpcProvider | InstanceType<typeof TonWeb.HttpProvider>;
    connection?: Connection;
}): ({ address, tokenAddress, tokenProgram, }: {
    address: string;
    tokenAddress?: string | null;
    tokenProgram?: string | null;
}) => Promise<string>;

interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    icon: string;
    icon_file?: File;
    tokenProgram?: string;
    usdPrice: string | null;
}
declare function getTokenInfo({ network, provider, }: {
    network: string;
    provider?: JsonRpcProvider;
}): (address: string) => Promise<TokenInfo>;

declare const RPC_URL: {
    BSC: string;
    SOLANA_DEV: string;
    SOLANA_MAIN: string;
    ETHEREUM_MAINNET: (key: string) => string;
};
declare const NETWORKS: {
    SOLANA: string;
    BSC: string;
    ETHEREUM: string;
    TON: string;
    TRON: string;
    BTC: string;
};
declare const BLOCK_TIME_MS: {
    SOLANA: number;
    BSC: number;
    ETH: number;
    TON: number;
    TRON: number;
    BTC: number;
};
declare const NATIVE_TOKEN_POOL_PAIRS: {
    SOLANA: string;
    BSC: string;
    ETH: string;
    TON: string;
    TRON: string;
    BTC: string;
};

declare function getGasFee({ network, transaction, }: {
    network: (typeof NETWORKS)[keyof typeof NETWORKS];
    transaction: ParsedTransactionWithMeta | TransactionReceipt | Transaction$1;
}): string;

declare function getBlockTime({ network, provider, transaction, }: {
    network: (typeof NETWORKS)[keyof typeof NETWORKS];
    provider?: JsonRpcProvider;
    transaction: TransactionReceipt | ParsedTransactionWithMeta | Transaction$1;
}): Promise<number>;

declare function getTransfer({ network, provider, connection, client, source, destination, }: {
    network: string;
    provider?: JsonRpcProvider;
    connection?: Connection;
    client?: TonClient;
    source: string;
    destination: string;
}): (hash: string) => Promise<Transfer>;

declare const ERC20_ABI: string[];

export { BLOCK_TIME_MS, ERC20_ABI, KeyVaultService, NATIVE_TOKEN_POOL_PAIRS, NETWORKS, RPC_URL, type TokenInfo, type Transfer, getBalance, getBlockTime, getGasFee, getTokenInfo, getTransfer, index as utils };
