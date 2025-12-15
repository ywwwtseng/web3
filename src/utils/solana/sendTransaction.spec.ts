// import { test, describe } from 'bun:test';
// import { Connection } from '@solana/web3.js';
// import { sendTransaction } from './sendTransaction';
// import { parseUnits } from '../units';
// import { RPC_URL } from '../../constants';

// describe('sendTransaction', () => {
//   test('should sign and send SPL token transfer transaction', async () => {
//     const connection = new Connection(RPC_URL.SOLANA_MAIN);
//     const privateKey = '58ca9762fa7ee907554caf609db383a2e538b5ee8dc70f0f49b9c3956a4f482b541e81f1fab935c28536c741908e6f8bf5f6ce3a2f37760cb3d95dee9e77f271';
//     const source = '6fNECwRQDdVQxsXbtYY4RLttRW1CoeVZ9GgodCchMS3z';
//     const destination = 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk';


//     const signature = await sendTransaction({
//       privateKey,
//       connection,
//       source,
//       destination,
//       amount: parseUnits('0.006836842', 9).toString(),
//     });

//     console.log(signature);
//   });
// });

