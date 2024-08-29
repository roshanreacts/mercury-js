import { Mercury } from '@mercury-js/core';

export function redis(MercuryClass: typeof Mercury): string {
  const mercuryInstance = new MercuryClass();
  return mercuryInstance.run() + ' redis';
}
