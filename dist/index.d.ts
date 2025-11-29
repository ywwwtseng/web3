import * as _solana_web3_js from '@solana/web3.js';
import { Keypair, Connection, SignaturesForAddressOptions, PublicKey, Transaction, ParsedTransactionWithMeta } from '@solana/web3.js';
export { _solana_web3_js as solana };
import { JsonRpcProvider, Wallet, TransactionReceipt } from 'ethers';
import * as ethers from 'ethers';
export { ethers };
import { TonClient, Transaction as Transaction$1 } from '@ton/ton';
import * as ton from '@ton/ton';
export { ton };
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import * as _ton_core from '@ton/core';
import TonWeb from 'tonweb';

declare function formatUnits(value: string | bigint, decimals: number): string;
declare function parseUnits(value: string, decimals: number): bigint;

declare function loadImage(url: string): Promise<Blob | null>;

declare function getRpcUrl(network: string, options?: {
    infuraApiKey?: string;
}): string;

declare class KeyPair {
    static from(secretKey: string | Uint8Array): Keypair;
    static generate(): Keypair;
}

declare function getSignaturesForAddress(connection: Connection, { address, ...options }: {
    address: string;
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
declare const index$3_hasATA: typeof hasATA;
declare namespace index$3 {
  export { type index$3_CreateTransactionParams as CreateTransactionParams, index$3_KeyPair as KeyPair, index$3_createATAInstruction as createATAInstruction, index$3_createSPLTransaction as createSPLTransaction, index$3_createSolanaTransaction as createSolanaTransaction, index$3_createTransaction as createTransaction, index$3_decodeTransfer as decodeTransfer, index$3_getAccountInfo as getAccountInfo, index$3_getParsedTransaction as getParsedTransaction, index$3_getSignaturesForAddress as getSignaturesForAddress, index$3_hasATA as hasATA, waitForTransaction$2 as waitForTransaction };
}

declare function getJettonWalletAddress(minterAddress: string, ownerAddress: string): Promise<string>;

declare function waitForTransaction$1({ client, hash, refetchInterval, refetchLimit, address, }: {
    client: TonClient;
    hash: string;
    refetchInterval?: number;
    refetchLimit?: number;
    address: string;
}): Promise<Transaction$1 | null>;

declare function getTransaction({ txHash, address, client, }: {
    txHash: string;
    client: TonClient;
    address: string;
}): Promise<_ton_core.Transaction>;

declare function getTxHash(boc: string): string;

declare const index$2_getJettonWalletAddress: typeof getJettonWalletAddress;
declare const index$2_getTransaction: typeof getTransaction;
declare const index$2_getTxHash: typeof getTxHash;
declare namespace index$2 {
  export { index$2_getJettonWalletAddress as getJettonWalletAddress, index$2_getTransaction as getTransaction, index$2_getTxHash as getTxHash, waitForTransaction$1 as waitForTransaction };
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

declare const index$1_estimateFee: typeof estimateFee;
declare const index$1_waitForTransaction: typeof waitForTransaction;
declare namespace index$1 {
  export { index$1_estimateFee as estimateFee, index$1_waitForTransaction as waitForTransaction };
}

declare const index_formatUnits: typeof formatUnits;
declare const index_getRpcUrl: typeof getRpcUrl;
declare const index_loadImage: typeof loadImage;
declare const index_parseUnits: typeof parseUnits;
declare namespace index {
  export { index$1 as evm, index_formatUnits as formatUnits, index_getRpcUrl as getRpcUrl, index_loadImage as loadImage, index_parseUnits as parseUnits, index$3 as solana, index$2 as ton };
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

type Transfer = {
    source: string;
    destination: string;
    amount: string;
    tokenAddress?: string;
    transaction: ParsedTransactionWithMeta | TransactionReceipt | Transaction$1;
};

declare const ERC20_ABI: string[];

export { BLOCK_TIME_MS, ERC20_ABI, KeyVaultService, NATIVE_TOKEN_POOL_PAIRS, NETWORKS, RPC_URL, type TokenInfo, type Transfer, getBalance, getBlockTime, getGasFee, getTokenInfo, getTransfer, index as utils };
