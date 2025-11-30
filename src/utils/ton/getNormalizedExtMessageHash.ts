import { beginCell, storeMessage, Message } from '@ton/ton';

export function getNormalizedExtMessageHash(message: Message) {
  if (message.info.type !== 'external-in') {
    throw new Error(`Message must be "external-in", got ${message.info.type}`);
  }
  const info = {
    ...message.info,
    src: undefined,
    importFee: 0n,
  };
  const normalizedMessage = {
    ...message,
    init: null,
    info: info,
  };
  return beginCell()
    .store(storeMessage(normalizedMessage, { forceRef: true }))
    .endCell()
    .hash();
}
