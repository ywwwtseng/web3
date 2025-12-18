// 格式化鏈上整數 → 可讀字串
export function formatUnits(value: string | bigint, decimals: number): string {
  const str = typeof value === 'bigint' ? value.toString() : value;

  if (decimals === 0) return str;

  // 如果長度不夠，補零
  const padded = str.padStart(decimals + 1, '0');

  const intPart = padded.slice(0, padded.length - decimals);
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, ''); // 去掉多餘 0

  return fracPart.length ? `${intPart}.${fracPart}` : intPart;
}

// 鏈上整數
export function parseUnits(value: string, decimals: number): bigint {
  if (!value.includes('.')) {
    return BigInt(value + '0'.repeat(decimals));
  }

  const [intPart, fracPart = ''] = value.split('.');

  if (fracPart.length > decimals) {
    throw new Error(`Too many decimal places (max ${decimals.toString()})`);
  }

  const fracPadded = fracPart.padEnd(decimals, '0');

  return BigInt(intPart ? intPart + fracPadded : fracPadded);
}

export function hex(value: string | number | bigint): string {
  return `0x${BigInt(value).toString(16)}`;
}