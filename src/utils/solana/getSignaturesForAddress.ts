import {
  Connection,
  PublicKey,
  SignaturesForAddressOptions,
} from '@solana/web3.js';
import { getATAsByOwner } from './getATAsByOwner';

export async function getSignaturesForAddress(
  connection: Connection,
  {
    address,
    ata = false,
    ...options
  }: {
    address: string;
    ata?: boolean;
  } & SignaturesForAddressOptions
) {
  const atas = ata ? await getATAsByOwner(connection, { address }) : [];
  const addresses = [address, ...atas];

  const signatures = new Set<string>();

  for (const address of addresses) {
    const result = await connection.getSignaturesForAddress(
      new PublicKey(address),
      {
        limit: 3,
        ...options,
      },
      'finalized'
    );

    result.forEach((s) => signatures.add(s.signature));
  }

  return Array.from(signatures);
}
