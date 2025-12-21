import * as ethereum from './ethereum';
import * as bsc from './bsc';

export const getTokenInfo = {
  ethereum: ethereum.getTokenInfo,
  bsc: bsc.getTokenInfo,
};