import { ethers } from 'ethers';
import { PublicKey } from '@solana/web3.js';
import { Address } from '@ton/ton';
import { NETWORKS } from '../constants';

export function getAddress({
  network,
  address,
}: {
  network: string;
  address: string;
}) {
  if (network === NETWORKS.SOLANA) {
    const publicKey = new PublicKey(address);
    return publicKey.toBase58();
  } else if (network === NETWORKS.BSC || network === NETWORKS.ETHEREUM) {
    return ethers.getAddress(address);
  } else if (network === NETWORKS.TON) {
    return Address.parse(address).toString({
      urlSafe: true,
      bounceable: false,
    });
  }

  throw new Error(`Network ${network} not supported`);
}