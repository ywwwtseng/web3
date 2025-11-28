import { JsonRpcProvider, Contract, getAddress } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { loadImage } from '../utils';

export async function getTokenIcon(address: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
  );
  const result = await res.json();
  const url = result.image.small;
  const blob = await loadImage(url);

  return {
    blob,
    url,
  };
}

export async function getTokenPrice(address: string) {
  let usdPrice: string | null = null;

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
    console.error('Price API error:', error);
  }

  return usdPrice;
}

export async function getTokenInfo({
  provider,
  address,
}: {
  provider: JsonRpcProvider;
  address: string;
}) {
  const contract = new Contract(address, ERC20_ABI, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  if (!name || !symbol || !decimals) {
    throw new Error('message.token_not_found');
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
    icon_file: icon.blob
      ? new File([icon.blob], name, {
          type: icon.blob.type,
        })
      : null,
    usdPrice,
  };
}
