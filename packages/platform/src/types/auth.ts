export interface ISession<T> {
  token: string;
  expires: number;
  user: T;
}

export interface IAuthConfig {
  sessionDuration: number;
  force2FA: boolean;
}

export interface IAuth {
  login: <T>(username: string, password: string) => Promise<T>;
  logout: (token: string) => Promise<boolean>;
  register: <T, K>(user: T) => Promise<K>;
  verify: <T>(token: string) => Promise<T>;
  changePassword: (token: string, password: string) => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  enable2FA: (token: string) => Promise<void>;
  disable2FA: (token: string) => Promise<void>;
  verify2FA: <T>(token: string, code: string) => Promise<ISession<T>>;
  generate2FASecret: (token: string) => Promise<string>;
}
