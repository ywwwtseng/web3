var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import * as solana from "@solana/web3.js";
import * as ethers from "ethers";

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  evm: () => evm_exports,
  formatUnits: () => formatUnits,
  getRpcUrl: () => getRpcUrl,
  loadImage: () => loadImage,
  parseUnits: () => parseUnits,
  solana: () => solana_exports,
  ton: () => ton_exports
});

// src/utils/units.ts
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
  BSC: "https://bsc-dataseed.binance.org",
  SOLANA_DEV: "https://api.devnet.solana.com",
  SOLANA_MAIN: "https://api.mainnet-beta.solana.com",
  ETHEREUM_MAINNET: (key) => `https://mainnet.infura.io/v3/${key}`
};
var NETWORKS = {
  SOLANA: "solana",
  BSC: "bsc",
  ETHEREUM: "ethereum",
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

// src/utils/rpc.ts
function getRpcUrl(network, options = {}) {
  switch (network) {
    case NETWORKS.SOLANA:
      return RPC_URL.SOLANA_DEV;
    case NETWORKS.BSC:
      return RPC_URL.BSC;
    case NETWORKS.ETHEREUM:
      if (!options.infuraApiKey) {
        throw new Error("Infura API key is required");
      }
      return RPC_URL.ETHEREUM_MAINNET(options.infuraApiKey);
    default:
      throw new Error(`Network ${network} not supported`);
  }
}

// src/utils/solana/index.ts
var solana_exports = {};
__export(solana_exports, {
  KeyPair: () => KeyPair,
  createATAInstruction: () => createATAInstruction,
  createSPLTransaction: () => createSPLTransaction,
  createSolanaTransaction: () => createSolanaTransaction,
  createTransaction: () => createTransaction,
  decodeTransfer: () => decodeTransfer,
  getAccountInfo: () => getAccountInfo,
  getParsedTransaction: () => getParsedTransaction,
  getSignaturesForAddress: () => getSignaturesForAddress,
  hasATA: () => hasATA
});

// src/utils/solana/KeyPair.ts
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

// src/utils/solana/getSignaturesForAddress.ts
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

// src/utils/solana/createTransaction.ts
import {
  PublicKey as PublicKey2,
  Transaction,
  SystemProgram
} from "@solana/web3.js";
import {
  getMint,
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { BN } from "@project-serum/anchor";
async function detectTokenProgram(connection, mintAddress) {
  const mint = new PublicKey2(mintAddress);
  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) {
    throw new Error(`Mint account not found: ${mintAddress}`);
  }
  if (mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    return TOKEN_2022_PROGRAM_ID;
  }
  return TOKEN_PROGRAM_ID;
}
async function hasATA(connection, mintAddress, ownerAddress, tokenProgram) {
  const ata = getAssociatedTokenAddressSync(
    new PublicKey2(mintAddress),
    new PublicKey2(ownerAddress),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const accountInfo = await connection.getAccountInfo(ata);
  return accountInfo !== null;
}
function createATAInstruction(payer, mint, owner, tokenProgram) {
  const ata = getAssociatedTokenAddressSync(
    mint,
    owner,
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return createAssociatedTokenAccountInstruction(
    payer,
    // 誰出 SOL 來建 ATA
    ata,
    // ATA 地址
    owner,
    // ATA 的持有者 (接收方)
    mint,
    // Token Mint
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}
async function createSolanaTransaction({
  source,
  destination,
  amount
}) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey2(source),
      toPubkey: new PublicKey2(destination),
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
  mint,
  tokenProgram
}) {
  if (tokenProgram) {
    tokenProgram = new PublicKey2(tokenProgram).equals(TOKEN_2022_PROGRAM_ID) ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
  } else {
    tokenProgram = await detectTokenProgram(connection, mint);
  }
  const mintInfo = await getMint(
    connection,
    new PublicKey2(mint),
    "confirmed",
    tokenProgram
    // TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID
  );
  const fromPayerATA = getAssociatedTokenAddressSync(
    new PublicKey2(mint),
    new PublicKey2(source),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const hasRecipientATA = await hasATA(
    connection,
    mint,
    destination,
    tokenProgram
  );
  const instructions = [];
  if (!hasRecipientATA) {
    instructions.push(
      createATAInstruction(
        new PublicKey2(feePayer),
        new PublicKey2(mint),
        new PublicKey2(destination),
        tokenProgram
      )
    );
  }
  const recipientATA = getAssociatedTokenAddressSync(
    new PublicKey2(mint),
    new PublicKey2(destination),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  if (tokenProgram.equals(TOKEN_2022_PROGRAM_ID)) {
    instructions.push(
      createTransferCheckedInstruction(
        fromPayerATA,
        new PublicKey2(mint),
        recipientATA,
        new PublicKey2(source),
        new BN(amount),
        mintInfo.decimals,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
  } else {
    instructions.push(
      createTransferInstruction(
        fromPayerATA,
        recipientATA,
        new PublicKey2(source),
        Number(amount),
        [],
        TOKEN_PROGRAM_ID
      )
    );
  }
  const transaction = new Transaction().add(...instructions);
  return transaction;
}
function createTransaction(connection, {
  feePayer,
  source,
  destination,
  amount,
  mint,
  tokenProgram
}) {
  if (mint) {
    return createSPLTransaction(connection, {
      feePayer,
      source,
      destination,
      amount,
      mint,
      tokenProgram
    });
  } else {
    return createSolanaTransaction({
      source,
      destination,
      amount
    });
  }
}

// src/utils/solana/decodeTransfer.ts
import {
  SystemProgram as SystemProgram2,
  Transaction as Transaction2,
  SystemInstruction
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID2,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID2,
  TOKEN_2022_PROGRAM_ID as TOKEN_2022_PROGRAM_ID2,
  decodeTransferInstruction,
  decodeTransferCheckedInstruction
} from "@solana/spl-token";

// src/utils/solana/getAccountInfo.ts
import { PublicKey as PublicKey3 } from "@solana/web3.js";
async function getAccountInfo(connection, publicKey) {
  const accountInfo = await connection.getParsedAccountInfo(
    new PublicKey3(publicKey)
  );
  const info = accountInfo.value?.data?.parsed?.info;
  return { owner: info?.owner, mint: info?.mint };
}

// src/utils/solana/decodeTransfer.ts
async function decodeTransfer(connection, base64) {
  const tx = Transaction2.from(Buffer.from(base64, "base64"));
  if (tx.instructions.length === 1) {
    if (tx.instructions[0].programId.equals(SystemProgram2.programId)) {
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
    } else if (tx.instructions[0].programId.equals(TOKEN_PROGRAM_ID2)) {
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
    } else if (tx.instructions[0].programId.equals(TOKEN_2022_PROGRAM_ID2)) {
      const ix = tx.instructions[0];
      const parsed = decodeTransferCheckedInstruction(
        ix,
        TOKEN_2022_PROGRAM_ID2
      );
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
    }
  } else if (tx.instructions.length === 2) {
    const cata_ix = tx.instructions.find(
      (ix2) => ix2.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID2)
    );
    let ix = tx.instructions.find(
      (ix2) => ix2.programId.equals(TOKEN_PROGRAM_ID2)
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
    ix = tx.instructions.find(
      (ix2) => ix2.programId.equals(TOKEN_2022_PROGRAM_ID2)
    );
    if (ix) {
      const parsed = decodeTransferCheckedInstruction(
        ix,
        TOKEN_2022_PROGRAM_ID2
      );
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

// src/utils/solana/getParsedTransaction.ts
async function getParsedTransaction({
  connection,
  signature
}) {
  return await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
    commitment: "finalized"
  });
}

// src/utils/ton/index.ts
var ton_exports = {};
__export(ton_exports, {
  getJettonWalletAddress: () => getJettonWalletAddress,
  getTransaction: () => getTransaction,
  waitForTransaction: () => waitForTransaction
});

// src/utils/ton/getJettonWalletAddress.ts
import TonWeb from "tonweb";
async function getJettonWalletAddress(minterAddress, ownerAddress) {
  const tonweb = new TonWeb();
  const JettonMinter = TonWeb.token.jetton.JettonMinter;
  const minter = new JettonMinter(tonweb.provider, {
    address: new TonWeb.utils.Address(minterAddress),
    adminAddress: new TonWeb.utils.Address(
      "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"
    ),
    // dummy zero address
    jettonContentUri: "",
    jettonWalletCodeHex: ""
    // dummy
  });
  const walletAddress = await minter.getJettonWalletAddress(
    new TonWeb.utils.Address(ownerAddress)
  );
  return walletAddress.toString(true, true, true, false);
}

// src/utils/ton/waitForTransaction.ts
import {
  Address,
  beginCell,
  storeMessage
} from "@ton/ton";
var waitForTransaction = async (options, client) => {
  const { hash, refetchInterval = 1e3, refetchLimit, address } = options;
  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    const interval = setInterval(async () => {
      refetches += 1;
      console.log("waiting transaction...");
      const state = await client.getContractState(walletAddress);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
      const lastTx = await client.getTransaction(
        walletAddress,
        lastLt,
        lastHash
      );
      if (lastTx && lastTx.inMessage) {
        const msgCell = beginCell().store(storeMessage(lastTx.inMessage)).endCell();
        const inMsgHash = msgCell.hash().toString("base64");
        console.log("InMsgHash", inMsgHash);
        if (inMsgHash === hash) {
          clearInterval(interval);
          resolve(lastTx);
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
};

// src/utils/ton/getTransaction.ts
import { Cell } from "@ton/ton";
async function getTransaction({
  boc,
  address,
  client
}) {
  const cell = Cell.fromBase64(boc);
  const buffer = cell.hash();
  const txHash = buffer.toString("hex");
  const transaction = await waitForTransaction(
    { hash: txHash, address },
    client
  );
  return transaction;
}

// src/utils/evm/index.ts
var evm_exports = {};
__export(evm_exports, {
  estimateFee: () => estimateFee
});

// src/utils/evm/estimateFee.ts
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

// src/utils/evm/estimateFee.ts
async function estimateFee({
  provider,
  tokenAddress,
  signer,
  destination,
  amount
}) {
  const feeData = await provider.getFeeData();
  if (!tokenAddress) {
    const gasLimit = 21000n;
    return (feeData.gasPrice * gasLimit).toString();
  } else {
    if (!signer) {
      throw new Error("Signer is required");
    }
    if (!destination) {
      throw new Error("Destination is required");
    }
    if (!amount) {
      throw new Error("Amount is required");
    }
    const contract = new Contract(tokenAddress, ERC20_ABI, signer);
    const gasLimit = await contract.transfer.estimateGas(
      destination,
      typeof amount === "string" ? BigInt(amount) : amount
    );
    return (feeData.gasPrice * gasLimit).toString();
  }
}

// src/KeyVaultService/index.ts
import { Wallet } from "ethers";
import { mnemonicNew, mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV5R1 } from "@ton/ton";
import TonWeb2 from "tonweb";

// src/algorithm/AES256GCM.ts
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

// src/KeyVaultService/index.ts
var KeyVaultService = class extends AES256GCM {
  get solana() {
    return {
      generate: () => {
        const wallet = KeyPair.generate();
        const hexPrivateKey = Buffer.from(wallet.secretKey).toString("hex");
        const encryptedPrivateKey = this.encrypt(hexPrivateKey);
        return {
          address: wallet.publicKey.toString(),
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
  get ton() {
    return {
      generate: async () => {
        const mnemonic = await mnemonicNew(24);
        const keyPair = await mnemonicToWalletKey(mnemonic);
        const hexPrivateKey = Buffer.from(keyPair.secretKey).toString("hex");
        const encryptedPrivateKey = this.encrypt(hexPrivateKey);
        const wallet = WalletContractV5R1.create({
          workchain: 0,
          publicKey: keyPair.publicKey
        });
        return {
          address: wallet.address,
          publicKey: keyPair.publicKey,
          privateKeyEncrypted: encryptedPrivateKey
        };
      },
      recover: (encryptedPrivateKey) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);
        const keyPair = TonWeb2.utils.nacl.sign.keyPair.fromSecretKey(
          Buffer.from(decryptedHex, "hex")
        );
        const publicKey = Buffer.from(keyPair.publicKey);
        const wallet = WalletContractV5R1.create({
          workchain: 0,
          publicKey
        });
        return {
          address: wallet.address,
          publicKey,
          privateKey: decryptedHex
        };
      }
    };
  }
};

// src/getBalance/index.ts
import { JsonRpcProvider as JsonRpcProvider2 } from "ethers";
import TonWeb4 from "tonweb";

// src/getBalance/solana.ts
import { PublicKey as PublicKey4 } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync as getAssociatedTokenAddressSync2,
  getAccount,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID3,
  TOKEN_2022_PROGRAM_ID as TOKEN_2022_PROGRAM_ID3,
  ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID3
} from "@solana/spl-token";
async function getBalance(connection, {
  address,
  tokenAddress,
  tokenProgram
}) {
  if (tokenAddress) {
    const programId = tokenProgram === TOKEN_2022_PROGRAM_ID3.toString() ? TOKEN_2022_PROGRAM_ID3 : TOKEN_PROGRAM_ID3;
    const ownerATA = getAssociatedTokenAddressSync2(
      new PublicKey4(tokenAddress),
      new PublicKey4(address),
      false,
      programId,
      ASSOCIATED_TOKEN_PROGRAM_ID3
    );
    const account = await getAccount(
      connection,
      ownerATA,
      void 0,
      programId
    );
    return String(account.amount);
  } else {
    const balance = await connection.getBalance(new PublicKey4(address));
    return String(balance);
  }
}

// src/getBalance/evm.ts
import { Contract as Contract2 } from "ethers";
async function getBalance2(provider, {
  address,
  tokenAddress
}) {
  if (tokenAddress) {
    const contract = new Contract2(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return String(balance);
  } else {
    const balance = await provider.getBalance(address);
    return String(balance);
  }
}

// src/getBalance/ton.ts
import TonWeb3 from "tonweb";
var getBalance3 = async ({
  provider,
  tokenAddress,
  address
}) => {
  const tonweb = new TonWeb3(provider ?? new TonWeb3.HttpProvider());
  if (tokenAddress) {
    const jettonWalletAddress = await utils_exports.ton.getJettonWalletAddress(
      tokenAddress,
      address
    );
    const jettonWallet = new TonWeb3.token.jetton.JettonWallet(tonweb.provider, {
      address: jettonWalletAddress
    });
    const data = await jettonWallet.getData();
    return data.balance.toString();
  } else {
    const balance = await tonweb.getBalance(address);
    return balance;
  }
};

// src/getBalance/index.ts
function getBalance4({
  network,
  provider,
  connection
}) {
  return async ({
    address,
    tokenAddress,
    tokenProgram
  }) => {
    if (network === NETWORKS.SOLANA) {
      if (!connection) {
        throw new Error("Connection is required for SOLANA");
      }
      return await getBalance(connection, {
        address,
        tokenAddress,
        tokenProgram
      });
    } else if (network === NETWORKS.BSC || network === NETWORKS.ETHEREUM) {
      if (!provider) {
        throw new Error("Provider is required for BSC or ETHEREUM");
      }
      if (!(provider instanceof JsonRpcProvider2)) {
        throw new Error("Provider must be an instance of JsonRpcProvider");
      }
      return await getBalance2(provider, {
        address,
        tokenAddress
      });
    } else if (network === NETWORKS.TON) {
      if (!provider) {
        throw new Error("Provider is required for TON");
      }
      if (!(provider instanceof TonWeb4.HttpProvider)) {
        throw new Error("Provider must be an instance of HttpProvider");
      }
      return await getBalance3({
        provider,
        address,
        tokenAddress
      });
    }
    throw new Error(`Network ${network} not supported`);
  };
}

// src/getTokenInfo/ethereum.ts
import { Contract as Contract3, getAddress } from "ethers";
async function getTokenIcon(address) {
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
async function getTokenPrice(address) {
  let usdPrice = null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
    );
    const data = await res.json();
    const tokenData = data[address.toLowerCase()];
    if (tokenData && tokenData.usd) {
      usdPrice = tokenData.usd.toString();
    }
    return usdPrice;
  } catch (error) {
    console.error("Price API error:", error);
  }
  return usdPrice;
}
async function getTokenInfo({
  provider,
  address
}) {
  const contract = new Contract3(address, ERC20_ABI, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  if (!name || !symbol || !decimals) {
    throw new Error("message.token_not_found");
  }
  const icon = await getTokenIcon(address);
  const usdPrice = await getTokenPrice(address);
  return {
    // return EIP-55 address
    address: getAddress(await contract.getAddress()),
    name,
    symbol,
    decimals: Number(decimals),
    icon: icon.url,
    icon_file: icon.blob ? new File([icon.blob], name, {
      type: icon.blob.type
    }) : null,
    usdPrice
  };
}

// src/getTokenInfo/bsc.ts
import { Contract as Contract4, getAddress as getAddress2 } from "ethers";
async function getTokenIcon2(address) {
  const url = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
  const blob = await loadImage(url);
  return {
    blob,
    url
  };
}
async function getTokenPrice2(address) {
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
    return usdPrice;
  } catch (error) {
    console.error("Price API error:", error);
  }
  return usdPrice;
}
async function getTokenInfo2({
  provider,
  address
}) {
  const contract = new Contract4(address, ERC20_ABI, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  if (!name || !symbol || !decimals) {
    throw new Error("message.token_not_found");
  }
  const icon = await getTokenIcon2(address);
  const usdPrice = await getTokenPrice2(address);
  return {
    // return EIP-55 address
    address: getAddress2(await contract.getAddress()),
    name,
    symbol,
    decimals: Number(decimals),
    icon: icon.url,
    icon_file: icon.blob ? new File([icon.blob], name, {
      type: icon.blob.type
    }) : null,
    usdPrice
  };
}

// src/getTokenInfo/solana.ts
async function getTokenInfo3({ address }) {
  const res = await fetch(
    `https://lite-api.jup.ag/tokens/v2/search?query=${address}`
  );
  const result = await res.json();
  if (result.length === 0) {
    throw new Error("message.token_not_found", {
      cause: `Token ${address} not found`
    });
  }
  const blob = await loadImage(result[0].icon);
  return {
    address: result[0].id,
    name: result[0].name,
    symbol: result[0].symbol,
    decimals: result[0].decimals,
    icon: result[0].icon,
    icon_file: blob ? new File([blob], result[0].name, {
      type: blob.type
    }) : null,
    usdPrice: result[0].usdPrice,
    tokenProgram: result[0].tokenProgram
  };
}

// src/getTokenInfo/ton.ts
async function getTokenInfo4({ address }) {
  if (address === "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs") {
    const res = await fetch(`https://tonapi.io/v2/jettons/${address}`);
    const data = await res.json();
    if (data.error) {
      throw new Error("message.token_not_found", {
        cause: `Token ${address} not found`
      });
    }
    const blob = await loadImage(data.metadata.image);
    return {
      name: data.metadata.name,
      symbol: data.metadata.symbol,
      decimals: Number(data.metadata.decimals),
      address,
      icon: data.metadata.image,
      icon_file: blob ? new File([blob], data.metadata.symbol.toLowerCase(), {
        type: blob.type
      }) : void 0,
      tokenProgram: void 0,
      usdPrice: "1"
    };
  } else {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/ton/contract/${address}`
    );
    const data = await res.json();
    if (data.error) {
      throw new Error("message.token_not_found", {
        cause: `Token ${address} not found`
      });
    }
    const blob = await loadImage(data.image.small);
    return {
      name: data.name,
      symbol: data.symbol,
      decimals: data.detail_platforms["the-open-network"].decimal_place,
      address: data.detail_platforms["the-open-network"].contract_address,
      icon: data.image.small,
      icon_file: blob ? new File([blob], data.symbol.toLowerCase(), { type: blob.type }) : void 0,
      tokenProgram: void 0,
      usdPrice: data.market_data.low_24h.usd.toString()
    };
  }
}

// src/getTokenInfo/tron.ts
async function getTokenInfo5({ address }) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/tron/contract/${address}`
  );
  const data = await res.json();
  if (data.error) {
    throw new Error("message.token_not_found", {
      cause: `Token ${address} not found`
    });
  }
  const blob = await loadImage(data.image.small);
  return {
    name: data.name,
    symbol: data.symbol,
    decimals: data.detail_platforms["tron"].decimal_place,
    address: data.detail_platforms["tron"].contract_address,
    icon: data.image.small,
    icon_file: blob ? new File([blob], data.symbol.toLowerCase(), { type: blob.type }) : void 0,
    tokenProgram: void 0,
    usdPrice: data.market_data.low_24h.usd.toString()
  };
}

// src/getTokenInfo/index.ts
function getTokenInfo6({
  network,
  provider
}) {
  return async (address) => {
    if (network === NETWORKS.ETHEREUM) {
      if (!provider) {
        throw new Error("Provider is required for ETHEREUM");
      }
      return await getTokenInfo({ provider, address });
    } else if (network === NETWORKS.BSC) {
      return await getTokenInfo2({ provider, address });
    } else if (network === NETWORKS.SOLANA) {
      return await getTokenInfo3({ address });
    } else if (network === NETWORKS.TON) {
      return await getTokenInfo4({ address });
    } else if (network === NETWORKS.TRON) {
      return await getTokenInfo5({ address });
    }
    throw new Error(`Network ${network} not supported`);
  };
}

// src/getGasFee/solana.ts
function getGasFee(parsedTransactionWithMeta) {
  return (parsedTransactionWithMeta.meta?.fee ?? 0).toString();
}

// src/getGasFee/evm.ts
function getGasFee2(receipt) {
  return (receipt.gasUsed * receipt.gasPrice).toString();
}

// src/getGasFee/index.ts
function getGasFee3({
  network
}) {
  return async (txData) => {
    if (network === NETWORKS.SOLANA) {
      return getGasFee(txData);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!txData) {
        throw new Error("Receipt is required for EVM");
      }
      return getGasFee2(txData);
    }
  };
}

// src/getBlockTime/solana.ts
function getBlockTime(parsedTransactionWithMeta) {
  return parsedTransactionWithMeta.blockTime;
}

// src/getBlockTime/evm.ts
async function getBlockTime2({
  provider,
  receipt
}) {
  const block = await provider.getBlock(receipt.blockNumber);
  return block.timestamp;
}

// src/getBlockTime/index.ts
function getBlockTime3({
  network,
  provider
}) {
  return async (txData) => {
    if (network === NETWORKS.SOLANA) {
      return getBlockTime(txData);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!provider) {
        throw new Error("Provider is required for EVM");
      }
      return await getBlockTime2({
        provider,
        receipt: txData
      });
    }
  };
}

// src/getTransfer/evm.ts
import {
  Interface
} from "ethers";
var transferIface = new Interface(ERC20_ABI);
async function getTransfer({
  provider,
  receipt
}) {
  if (typeof receipt === "string") {
    receipt = await provider.getTransactionReceipt(receipt);
  }
  if (receipt.status !== 1) {
    return null;
  }
  const transaction = await provider.getTransaction(receipt.hash);
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

// src/getTransfer/solana.ts
async function getTransfers({
  connection,
  transaction
}) {
  if (typeof transaction === "string") {
    transaction = await connection.getParsedTransaction(transaction, {
      maxSupportedTransactionVersion: 0,
      commitment: "finalized"
    });
  }
  const transfers = [];
  const mint = transaction.meta?.preTokenBalances?.[0]?.mint;
  if (mint) {
    const preMap = /* @__PURE__ */ new Map();
    const postMap = /* @__PURE__ */ new Map();
    const senders = [];
    const receivers = [];
    transaction.meta?.preTokenBalances?.forEach((b) => {
      if (b.owner) {
        preMap.set(`${b.mint}_${b.owner}`, b);
      }
    });
    transaction.meta?.postTokenBalances?.forEach((b) => {
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
    for (const ix of transaction.transaction.message.instructions) {
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

// src/getTransfer/index.ts
function getTransfer2({
  network,
  provider,
  connection,
  source,
  destination
}) {
  return async (txData) => {
    if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!provider) {
        throw new Error("Provider is required for EVM");
      }
      const transfer = await getTransfer({
        provider,
        receipt: txData
      });
      if (transfer && transfer.source === source && transfer.destination === destination) {
        return transfer;
      } else {
        return null;
      }
    } else if (network === NETWORKS.SOLANA) {
      const transfers = await getTransfers({
        connection,
        transaction: txData
      });
      return transfers.find(
        (transfer) => transfer.source === source && transfer.destination === destination
      ) ?? null;
    }
    throw new Error(`Network ${network} not supported`);
  };
}
export {
  BLOCK_TIME_MS,
  ERC20_ABI,
  KeyVaultService,
  NATIVE_TOKEN_POOL_PAIRS,
  NETWORKS,
  RPC_URL,
  ethers,
  getBalance4 as getBalance,
  getBlockTime3 as getBlockTime,
  getGasFee3 as getGasFee,
  getTokenInfo6 as getTokenInfo,
  getTransfer2 as getTransfer,
  solana,
  utils_exports as utils
};
