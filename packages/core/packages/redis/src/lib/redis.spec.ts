import { redis } from './redis';
import { Mercury } from '@mercury-js/core';

describe('redis', () => {
  it('should work', () => {
    expect(redis(Mercury)).toEqual('Mercury run redis');
  });
});
