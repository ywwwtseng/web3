import * as _solana_web3_js from '@solana/web3.js';
import { Keypair, Connection, SignaturesForAddressOptions, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
export { _solana_web3_js as solana };
import * as ethers from 'ethers';
import { Wallet, JsonRpcProvider, TransactionReceipt } from 'ethers';
export { ethers };

declare class KeyPair {
    static from(secretKey: string | Uint8Array): Keypair;
    static generate(): Keypair;
}

declare function getSignaturesForAddress(connection: Connection, { address, ...options }: {
    address: string;
} & SignaturesForAddressOptions): Promise<string[]>;

declare class AES256GCM {
    private key;
    constructor(key: string | Buffer);
    encrypt(hexPrivateKey: string): string;
    decrypt(encrypted: string): string;
}

declare class KeyVaultService extends AES256GCM {
    get solana(): {
        generate: () => {
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
}

declare class Balance {
    static get solana(): {
        get: (connection: Connection, { address, tokenAddress, }: {
            address: string;
            tokenAddress?: string | null;
        }) => Promise<number | bigint>;
    };
    static get evm(): {
        get: (provider: JsonRpcProvider, { address, tokenAddress, }: {
            address: string;
            tokenAddress?: string | null;
        }) => Promise<any>;
    };
}

interface CreateSolanaTransactionParams {
    feePayer: string | PublicKey;
    source: string | PublicKey;
    destination: string | PublicKey;
    amount: bigint | string | number;
    mint?: string | PublicKey | null;
}

type Transfer = {
    source: string;
    destination: string;
    amount: string;
    tokenAddress?: string;
};

declare class Transaction {
    static get solana(): {
        get: (connection: Connection, { signature, }: {
            signature: string;
        }) => Promise<ParsedTransactionWithMeta>;
        create: (connection: Connection, params: CreateSolanaTransactionParams) => Promise<_solana_web3_js.Transaction>;
        decodeTransfer: (connection: Connection, base64: string) => Promise<Transfer>;
        getTransfers: (connection: Connection, src: string | ParsedTransactionWithMeta) => Promise<Transfer[]>;
        getGasFee: (parsedTransactionWithMeta: ParsedTransactionWithMeta) => string;
        getBlockTime: (parsedTransactionWithMeta: ParsedTransactionWithMeta) => number;
    };
    static get evm(): {
        get: (provider: JsonRpcProvider, txHash: string) => Promise<ethers.TransactionResponse>;
        getReceipt: (provider: JsonRpcProvider, txHash: string) => Promise<TransactionReceipt>;
        getTransfer: (provider: JsonRpcProvider, src: string | TransactionReceipt) => Promise<Transfer>;
        getGasFee: (receipt: TransactionReceipt) => string;
        getBlockTime: (provider: JsonRpcProvider, receipt: TransactionReceipt) => Promise<number>;
        estimateFee: (provider: JsonRpcProvider, params?: {
            tokenAddress: string;
            signer: Wallet;
            destination: string;
            amount: string | bigint;
        }) => Promise<string>;
    };
    static getGasFee(src: ParsedTransactionWithMeta | TransactionReceipt): string;
    static getBlockTime(src: ParsedTransactionWithMeta | TransactionReceipt, rpcUrl: string): Promise<number>;
    static getTransfer(src: string | ParsedTransactionWithMeta | TransactionReceipt, params: {
        rpcUrl: string;
        source: string;
        destination: string;
    }): Promise<Transfer | null>;
}

interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    icon_file?: File;
    usdPrice: string | null;
}
declare class Token {
    static get solana(): {
        getInfo: (address: string) => Promise<TokenInfo>;
    };
    static get evm(): {
        getInfo: ({ address, network, rpcUrl, }: {
            address: string;
            network: string;
            rpcUrl: string;
        }) => Promise<TokenInfo>;
        getIcon: (network: string, address: string) => Promise<{
            blob: Blob;
            url: any;
        }>;
    };
    static getInfo({ address, network, rpcUrl, }: {
        address: string;
        network: string;
        rpcUrl: string;
    }): Promise<TokenInfo>;
}

declare function getRpcUrl(network: string): string;

declare const RPC_URL: {
    BSC: string;
    SOLANA_DEV: string;
    SOLANA_MAIN: string;
};
declare const NETWORKS: {
    SOLANA: string;
    BSC: string;
    ETH: string;
    TON: string;
    TRON: string;
    BTC: string;
};
declare const NATIVE_TOKEN_POOL_PAIRS: {
    SOLANA: string;
    BSC: string;
    ETH: string;
    TON: string;
    TRON: string;
    BTC: string;
};
declare const CHAIN_IDS: {
    BSC: number;
    ETH: number;
};

declare const ERC20_ABI: string[];

export { Balance, CHAIN_IDS, ERC20_ABI, KeyPair, KeyVaultService, NATIVE_TOKEN_POOL_PAIRS, NETWORKS, RPC_URL, Token, type TokenInfo, Transaction, type Transfer, getRpcUrl, getSignaturesForAddress };
