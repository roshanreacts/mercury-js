import { IMercury } from '../types/core';

export class Mercury implements IMercury {
  log = 'Mercury log';
  version = '1.0.0';
  constructor() {
    console.log('Mercury constructor');
  }
  run = () => {
    return 'Mercury run';
  };
}
