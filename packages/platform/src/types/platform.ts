import { Mercury } from '@mercury-js/core';
import { ILogger } from './logger';
import { IAuth } from './auth';

export type Config = {
  uri: string;
  auth?: IAuth;
  logger: ILogger;
  plugins?: TPlugin[];
};

export type PermissionsSet = { [x: string]: { core: boolean } };

export type TPlugin = {
  name: string;
  init: ({ core }: { core: Promise<Mercury> }) => Promise<void>;
  run: ({ core }: { core: Promise<Mercury> }) => Promise<void>;
};
