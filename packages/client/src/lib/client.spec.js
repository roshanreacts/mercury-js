import MercuryClient from './client';
import { request } from 'graphql-request';

describe('client', () => {
  const clientStr = 'client';
  const uri = 'http://localhost:4000/graphql';
  const client = new MercuryClient({
    client: request,
    uri,
  });
  it('should have a model', () => {
    client.start();
    expect(client.Users.create()).toBe('Created for User');
    expect(client.Accounts.create()).toBe('Created for Account');
  });
});
