// src/index.ts
import * as solana from "@solana/web3.js";
import * as ethers from "ethers";

// src/solana/KeyPair/KeyPair.ts
import { Keypair } from "@solana/web3.js";
var KeyPair = class {
  static from(secretKey) {
    return Keypair.fromSecretKey(
      secretKey instanceof Uint8Array ? secretKey : Uint8Array.from(Buffer.from(secretKey, "hex"))
    );
  }
  static generate() {
    return Keypair.generate();
  }
};

// src/solana/getSignaturesForAddress/getSignaturesForAddress.ts
import {
  PublicKey
} from "@solana/web3.js";
async function getSignaturesForAddress(connection, {
  address,
  ...options
}) {
  const result = await connection.getSignaturesForAddress(
    new PublicKey(address),
    {
      limit: 3,
      ...options
    },
    "finalized"
  );
  return result.map((s) => s.signature);
}

// src/KeyVaultService/KeyVaultService.ts
import { Wallet } from "ethers";

// src/utils/AES256GCM.ts
import crypto from "crypto";
var AES256GCM = class {
  key;
  constructor(key) {
    key = typeof key === "string" ? key : key.toString("hex");
    if (key.length !== 64) {
      throw new Error("Encryption key must be 64 characters long");
    }
    this.key = key;
  }
  encrypt(hexPrivateKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(this.key, "hex"),
      iv.toString("hex")
    );
    let encrypted = cipher.update(hexPrivateKey, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${encrypted}:${tag}`;
  }
  decrypt(encrypted) {
    const [ivHex, encryptedHex, tagHex] = encrypted.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(this.key, "hex"),
      ivHex
    );
    decipher.setAuthTag(new Uint8Array(Buffer.from(tagHex, "hex")));
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};

// src/KeyVaultService/KeyVaultService.ts
var KeyVaultService = class extends AES256GCM {
  get solana() {
    return {
      generate: () => {
        const wallet = KeyPair.generate();
        const hexPrivateKey = Buffer.from(wallet.secretKey).toString("hex");
        const encryptedPrivateKey = this.encrypt(hexPrivateKey);
        return {
          publicKey: wallet.publicKey,
          privateKeyEncrypted: encryptedPrivateKey
        };
      },
      recover: (encryptedPrivateKey) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);
        return KeyPair.from(decryptedHex);
      }
    };
  }
  get evm() {
    return {
      generate: () => {
        const wallet = Wallet.createRandom();
        const encryptedPrivateKey = this.encrypt(wallet.privateKey);
        return {
          address: wallet.address,
          publicKey: wallet.publicKey,
          privateKeyEncrypted: encryptedPrivateKey
        };
      },
      recover: (encryptedPrivateKey) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);
        return new Wallet(decryptedHex);
      }
    };
  }
};

// src/Balance/Balance.ts
import { PublicKey as PublicKey2 } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { Contract } from "ethers";

// src/abi/ERC20_ABI.ts
var ERC20_ABI = [
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// src/Balance/Balance.ts
var Balance = class {
  static get solana() {
    return {
      get: async (connection, {
        address,
        tokenAddress
      }) => {
        if (tokenAddress) {
          const ownerATA = getAssociatedTokenAddressSync(
            new PublicKey2(tokenAddress),
            new PublicKey2(address),
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          const account = await getAccount(connection, ownerATA);
          return account.amount;
        } else {
          return await connection.getBalance(new PublicKey2(address));
        }
      }
    };
  }
  static get evm() {
    return {
      get: async (provider, {
        address,
        tokenAddress
      }) => {
        if (tokenAddress) {
          const contract = new Contract(tokenAddress, ERC20_ABI, provider);
          return await contract.balanceOf(address);
        } else {
          return await provider.getBalance(address);
        }
      }
    };
  }
};

// src/Transaction/Transaction.ts
import { Connection as Connection6 } from "@solana/web3.js";
import {
  JsonRpcProvider as JsonRpcProvider2,
  Contract as Contract2
} from "ethers";

// src/solana/createTransaction.ts
import {
  PublicKey as PublicKey3,
  Transaction,
  SystemProgram
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync as getAssociatedTokenAddressSync2,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID2,
  ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID2
} from "@solana/spl-token";
async function hasAta(connection, mintAddress, ownerAddress) {
  const ata = getAssociatedTokenAddressSync2(
    new PublicKey3(mintAddress),
    new PublicKey3(ownerAddress)
  );
  const accountInfo = await connection.getAccountInfo(ata);
  return accountInfo !== null;
}
function createAtaInstruction(payer, mint, owner) {
  const ata = getAssociatedTokenAddressSync2(mint, owner);
  return createAssociatedTokenAccountInstruction(
    payer,
    // 誰出 SOL 來建 ATA
    ata,
    // ATA 地址
    owner,
    // ATA 的持有者 (接收方)
    mint,
    // Token Mint
    TOKEN_PROGRAM_ID2,
    ASSOCIATED_TOKEN_PROGRAM_ID2
  );
}
async function createSolanaTransaction({
  source,
  destination,
  amount
}) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey3(source),
      toPubkey: new PublicKey3(destination),
      lamports: Number(amount)
    })
  );
  return transaction;
}
async function createSPLTransaction(connection, {
  feePayer,
  source,
  destination,
  amount,
  mint
}) {
  const fromPayerATA = getAssociatedTokenAddressSync2(
    new PublicKey3(mint),
    new PublicKey3(source),
    false,
    TOKEN_PROGRAM_ID2,
    ASSOCIATED_TOKEN_PROGRAM_ID2
  );
  const hasRecipientATA = await hasAta(connection, mint, destination);
  const instructions = [];
  if (!hasRecipientATA) {
    instructions.push(
      createAtaInstruction(
        new PublicKey3(feePayer),
        new PublicKey3(mint),
        new PublicKey3(destination)
      )
    );
  }
  const recipientATA = getAssociatedTokenAddressSync2(
    new PublicKey3(mint),
    new PublicKey3(destination),
    false,
    TOKEN_PROGRAM_ID2,
    ASSOCIATED_TOKEN_PROGRAM_ID2
  );
  instructions.push(
    createTransferInstruction(
      fromPayerATA,
      recipientATA,
      new PublicKey3(source),
      Number(amount),
      [],
      TOKEN_PROGRAM_ID2
    )
  );
  const transaction = new Transaction().add(...instructions);
  return transaction;
}
function createTransaction(connection, { feePayer, source, destination, amount, mint }) {
  if (mint) {
    return createSPLTransaction(connection, {
      feePayer,
      source,
      destination,
      amount,
      mint
    });
  } else {
    return createSolanaTransaction({
      source,
      destination,
      amount
    });
  }
}

// src/solana/decodeTransfer.ts
import {
  SystemProgram as SystemProgram2,
  Transaction as Transaction2,
  SystemInstruction
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID3,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID3,
  decodeTransferInstruction
} from "@solana/spl-token";

// src/solana/getAccountInfo.ts
import { PublicKey as PublicKey4 } from "@solana/web3.js";
async function getAccountInfo(connection, publicKey) {
  const accountInfo = await connection.getParsedAccountInfo(
    new PublicKey4(publicKey)
  );
  const info = accountInfo.value?.data?.parsed?.info;
  return { owner: info?.owner, mint: info?.mint };
}

// src/solana/decodeTransfer.ts
async function decodeTransfer(connection, base64) {
  const tx = Transaction2.from(Buffer.from(base64, "base64"));
  if (tx.instructions.length === 1 && tx.instructions[0].programId.equals(SystemProgram2.programId)) {
    const ix = tx.instructions[0];
    const parsed = SystemInstruction.decodeTransfer(ix);
    const source = parsed.fromPubkey.toBase58();
    const destination = parsed.toPubkey.toBase58();
    const amount = parsed.lamports.toString();
    return {
      source,
      destination,
      amount
    };
  } else if (tx.instructions.length === 1 && tx.instructions[0].programId.equals(TOKEN_PROGRAM_ID3)) {
    const ix = tx.instructions[0];
    const parsed = decodeTransferInstruction(ix);
    const amount = parsed.data.amount.toString();
    const sourceInfo = await getAccountInfo(
      connection,
      parsed.keys.source.pubkey
    );
    const destinationInfo = await getAccountInfo(
      connection,
      parsed.keys.destination.pubkey
    );
    return {
      source: sourceInfo.owner,
      destination: destinationInfo.owner,
      amount,
      tokenAddress: sourceInfo.mint
    };
  } else if (tx.instructions.length === 2) {
    const cata_ix = tx.instructions.find(
      (ix2) => ix2.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID3)
    );
    const ix = tx.instructions.find(
      (ix2) => ix2.programId.equals(TOKEN_PROGRAM_ID3)
    );
    if (ix) {
      const parsed = decodeTransferInstruction(ix);
      const amount = parsed.data.amount.toString();
      const sourceInfo = await getAccountInfo(
        connection,
        parsed.keys.source.pubkey
      );
      return {
        source: sourceInfo.owner,
        destination: cata_ix.keys[2].pubkey.toBase58(),
        amount,
        tokenAddress: sourceInfo.mint
      };
    }
  }
  throw new Error("Invalid transfer transaction");
}

// src/solana/getTransfers.ts
function getTransfers(parsedTransaction) {
  const transfers = [];
  const mint = parsedTransaction.meta?.preTokenBalances?.[0]?.mint;
  if (mint) {
    const preMap = /* @__PURE__ */ new Map();
    const postMap = /* @__PURE__ */ new Map();
    const senders = [];
    const receivers = [];
    parsedTransaction.meta?.preTokenBalances?.forEach((b) => {
      if (b.owner) {
        preMap.set(`${b.mint}_${b.owner}`, b);
      }
    });
    parsedTransaction.meta?.postTokenBalances?.forEach((b) => {
      if (b.owner) {
        postMap.set(`${b.mint}_${b.owner}`, b);
      }
    });
    postMap.forEach((postBalance, key) => {
      const preBalance = preMap.get(key);
      const postAmount = Number(postBalance.uiTokenAmount.amount ?? "0");
      const preAmount = Number(preBalance?.uiTokenAmount.amount ?? "0");
      const delta = postAmount - preAmount;
      if (delta > 0) {
        receivers.push({
          mint: postBalance.mint,
          owner: postBalance.owner,
          delta
        });
      } else if (delta < 0) {
        senders.push({
          mint: postBalance.mint,
          owner: postBalance.owner,
          delta
        });
      }
    });
    receivers.forEach((receiver) => {
      const sender = senders.find((s) => s.mint === receiver.mint);
      if (!sender) return;
      transfers.push({
        tokenAddress: receiver.mint,
        source: sender.owner,
        destination: receiver.owner,
        amount: receiver.delta.toString()
      });
    });
  } else {
    for (const ix of parsedTransaction.transaction.message.instructions) {
      if ("parsed" in ix) {
        const parsed = ix.parsed;
        if (parsed.type === "transfer") {
          const info = parsed.info;
          const source = info.source;
          const destination = info.destination;
          const lamports = Number(info.lamports);
          const found = transfers.find(
            (r) => r.destination === destination && r.source === source
          );
          if (!found) {
            transfers.push({
              source,
              destination,
              amount: lamports.toString()
            });
          } else {
            found.amount += lamports;
          }
        }
      }
    }
  }
  return transfers;
}

// src/evm/getTransfer.ts
import { Interface } from "ethers";
var transferIface = new Interface(ERC20_ABI);
async function getTransfer({
  receipt,
  transaction
}) {
  if (receipt.status !== 1) {
    return null;
  }
  if (transaction.value && transaction.value > 0n && receipt.logs.length === 0) {
    return {
      source: transaction.from,
      destination: transaction.to,
      amount: transaction.value.toString()
    };
  }
  for (const log of receipt.logs) {
    try {
      const parsed = transferIface.parseLog(log);
      if (parsed?.name === "Transfer") {
        const tokenAddress = log.address;
        const rawAmount = parsed.args.value;
        return {
          source: parsed.args.from,
          destination: parsed.args.to,
          amount: rawAmount.toString(),
          tokenAddress
        };
      }
    } catch (err) {
    }
  }
  return null;
}

// src/Transaction/Transaction.ts
var Transaction3 = class _Transaction {
  static get solana() {
    return {
      get: async (connection, {
        signature
      }) => {
        const transaction = await connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
          commitment: "finalized"
        });
        return transaction;
      },
      create: async (connection, params) => {
        return createTransaction(connection, params);
      },
      decodeTransfer: async (connection, base64) => {
        return decodeTransfer(connection, base64);
      },
      getTransfers: async (connection, src) => {
        if (typeof src === "string") {
          const parsedTransaction = await _Transaction.solana.get(connection, {
            signature: src
          });
          return getTransfers(parsedTransaction);
        } else {
          return getTransfers(src);
        }
      },
      getGasFee: (parsedTransactionWithMeta) => {
        return (parsedTransactionWithMeta.meta?.fee ?? 0).toString();
      },
      getBlockTime: (parsedTransactionWithMeta) => {
        return parsedTransactionWithMeta.blockTime;
      }
    };
  }
  static get evm() {
    return {
      get: async (provider, txHash) => {
        return await provider.getTransaction(txHash);
      },
      getReceipt: async (provider, txHash) => {
        return await provider.getTransactionReceipt(txHash);
      },
      getTransfer: async (provider, src) => {
        let receipt = src;
        if (typeof src === "string") {
          receipt = await _Transaction.evm.getReceipt(provider, src);
        }
        if (!receipt || typeof receipt !== "object" || "status" in receipt && receipt.status !== 1) {
          return null;
        }
        const transaction = await _Transaction.evm.get(provider, receipt.hash);
        return getTransfer({ receipt, transaction });
      },
      getGasFee: (receipt) => {
        return (receipt.gasUsed * receipt.gasPrice).toString();
      },
      getBlockTime: async (provider, receipt) => {
        const block = await provider.getBlock(receipt.blockNumber);
        return block.timestamp;
      },
      estimateFee: async (provider, params) => {
        const feeData = await provider.getFeeData();
        if (!params) {
          const gasLimit = 21000n;
          return (feeData.gasPrice * gasLimit).toString();
        } else {
          const contract = new Contract2(
            params.tokenAddress,
            ERC20_ABI,
            params.signer
          );
          const gasLimit = await contract.transfer.estimateGas(
            params.destination,
            typeof params.amount === "string" ? BigInt(params.amount) : params.amount
          );
          return (feeData.gasPrice * gasLimit).toString();
        }
      }
    };
  }
  static getGasFee(src) {
    if ("meta" in src) {
      return _Transaction.solana.getGasFee(src);
    } else {
      return _Transaction.evm.getGasFee(src);
    }
  }
  static async getBlockTime(src, rpcUrl) {
    if ("meta" in src) {
      return _Transaction.solana.getBlockTime(src);
    } else {
      const provider = new JsonRpcProvider2(rpcUrl);
      return await _Transaction.evm.getBlockTime(provider, src);
    }
  }
  static async getTransfer(src, params) {
    if (params.source.startsWith("0x")) {
      const receipt = src;
      const provider = new JsonRpcProvider2(params.rpcUrl);
      const transfer = await _Transaction.evm.getTransfer(provider, receipt);
      if (transfer && transfer.source === params.source && transfer.destination === params.destination) {
        return transfer;
      } else {
        return null;
      }
    } else {
      const tx = src;
      const connection = new Connection6(params.rpcUrl);
      const transfers = await _Transaction.solana.getTransfers(connection, tx);
      return transfers.find(
        (transfer) => transfer.source === params.source && transfer.destination === params.destination
      ) ?? null;
    }
  }
};

// src/Token/Token.ts
import { JsonRpcProvider as JsonRpcProvider3, Contract as Contract3 } from "ethers";

// src/utils/loaders.ts
async function loadImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    return await res.blob();
  } catch (error) {
    return null;
  }
}

// src/constants.ts
var RPC_URL = {
  BSC: "https://bsc-dataseed.binance.org/",
  SOLANA_DEV: "https://api.devnet.solana.com",
  SOLANA_MAIN: "https://api.mainnet-beta.solana.com"
};
var NETWORKS = {
  SOLANA: "solana",
  BSC: "bsc",
  ETH: "ethereum",
  TON: "ton",
  TRON: "tron",
  BTC: "bitcoin"
};
var BLOCK_TIME_MS = {
  SOLANA: 400,
  BSC: 750,
  ETH: 12e3,
  TON: 5e3,
  TRON: 3e3,
  BTC: 6e5
};
var NATIVE_TOKEN_POOL_PAIRS = {
  SOLANA: "SOLUSDT",
  BSC: "BNBUSDT",
  ETH: "ETHUSDT",
  TON: "TONUSDT",
  TRON: "TRXUSDT",
  BTC: "BTCUSDT"
};
var CHAIN_IDS = {
  BSC: 56,
  ETH: 1
};

// src/Token/Token.ts
var Token = class {
  static get solana() {
    return {
      getInfo: async (address) => {
        const res = await fetch(
          `https://lite-api.jup.ag/tokens/v2/search?query=${address}`
        );
        const result = await res.json();
        if (result.length === 0) {
          throw new Error("message.token_not_found");
        }
        const blob = await loadImage(result[0].icon);
        return {
          name: result[0].name,
          symbol: result[0].symbol,
          decimals: result[0].decimals,
          icon: result[0].icon,
          icon_file: blob ? new File([blob], result[0].name, {
            type: blob.type
          }) : null,
          usdPrice: result[0].usdPrice
        };
      }
    };
  }
  static get evm() {
    return {
      getInfo: async ({
        address,
        network,
        rpcUrl
      }) => {
        const provider = new JsonRpcProvider3(rpcUrl);
        const contract = new Contract3(address, ERC20_ABI, provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        if (!name || !symbol || !decimals) {
          throw new Error("message.token_not_found");
        }
        const icon = await this.evm.getIcon(network, address);
        let usdPrice = null;
        try {
          const res = await fetch(
            `https://api.dexscreener.com/latest/dex/search?q=${address}`
          );
          const data = await res.json();
          if (data.pairs && data.pairs.length > 0) {
            const mainPair = data.pairs.sort(
              (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
            )[0];
            usdPrice = mainPair.priceUsd ?? null;
          }
        } catch (error) {
          console.error("Dexscreener error:", error);
        }
        return {
          name,
          symbol,
          decimals: Number(decimals),
          icon: icon.url,
          icon_file: icon.blob ? new File([icon.blob], name, {
            type: icon.blob.type
          }) : null,
          usdPrice
        };
      },
      getIcon: async (network, address) => {
        if (network === NETWORKS.BSC) {
          const url2 = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
          const blob2 = await loadImage(url2);
          return {
            blob: blob2,
            url: url2
          };
        }
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
        );
        const result = await res.json();
        const url = result.image.small;
        const blob = await loadImage(url);
        return {
          blob,
          url
        };
      }
    };
  }
  static async getInfo({
    address,
    network,
    rpcUrl
  }) {
    if (network === NETWORKS.SOLANA) {
      return await this.solana.getInfo(address);
    } else {
      return await this.evm.getInfo({ rpcUrl, network, address });
    }
  }
};

// src/utils/rpc.ts
function getRpcUrl(network) {
  switch (network) {
    case NETWORKS.SOLANA:
      return RPC_URL.SOLANA_DEV;
    case NETWORKS.BSC:
      return RPC_URL.BSC;
    default:
      throw new Error(`Network ${network} not supported`);
  }
}

// src/utils/amount.ts
function formatUnits(value, decimals) {
  const str = typeof value === "bigint" ? value.toString() : value;
  if (decimals === 0) return str;
  const padded = str.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals);
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, "");
  return fracPart.length ? `${intPart}.${fracPart}` : intPart;
}
function parseUnits(value, decimals) {
  if (!value.includes(".")) {
    return BigInt(value + "0".repeat(decimals));
  }
  const [intPart, fracPart = ""] = value.split(".");
  if (fracPart.length > decimals) {
    throw new Error(`Too many decimal places (max ${decimals.toString()})`);
  }
  const fracPadded = fracPart.padEnd(decimals, "0");
  return BigInt(intPart ? intPart + fracPadded : fracPadded);
}
export {
  BLOCK_TIME_MS,
  Balance,
  CHAIN_IDS,
  ERC20_ABI,
  KeyPair,
  KeyVaultService,
  NATIVE_TOKEN_POOL_PAIRS,
  NETWORKS,
  RPC_URL,
  Token,
  Transaction3 as Transaction,
  ethers,
  formatUnits,
  getRpcUrl,
  getSignaturesForAddress,
  parseUnits,
  solana
};
