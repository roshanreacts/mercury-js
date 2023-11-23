import redisCache, { Redis } from '../../src/packages/redisCache';
import mercury from '../../src/mercury';

mercury.package([redisCache()]);

describe('redis cache package using mercury', () => {
  const cache = mercury.cache;
  it('should set the key and value to redis', async () => {
    const key: string = 'mercury';
    const value: string = 'graphql';
    await cache.set(key, value);
    const getMercury = await cache.get(key);
    expect(getMercury).toBe(value);
  });

  it('should create schema', async () => {
    await cache.createSchema(
      'users',
      {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      {}
    );

    expect(cache.models.length).toBe(1);
  });

  it('should insert data into the schema', async () => {
    const data = { id: 1, name: 'test', age: Math.floor(Math.random() * 100) };
    const result = await cache.insert('users', data);
    expect(result).toEqual(data);
  });
  it('should search the schema', async () => {
    const result = await cache.search('users', 'test');
    expect(result.total).toEqual(1);
  });
});

describe('redis cache package', () => {
  const cache = new Redis();
  it('should set the key and value to redis', async () => {
    const key: string = 'mercury';
    const value: string = 'graphql';
    await cache.set(key, value);
    const getMercury = await cache.get(key);
    expect(getMercury).toBe(value);
  });

  it('should create schema', async () => {
    await cache.createSchema(
      'users',
      {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      {}
    );

    expect(cache.models.length).toBe(1);
  });

  it('should insert data into the schema', async () => {
    const data = { id: 1, name: 'test', age: Math.floor(Math.random() * 100) };
    const result = await cache.insert('users', data);
    expect(result).toEqual(data);
  });
  it('should search the schema', async () => {
    const result = await cache.search('users', 'test');
    expect(result.total).toEqual(1);
  });
});
