import Redis from '../../src/packages/redisCache';

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
      'test',
      {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      {}
    );

    expect(cache.models.length).toBe(1);
  });

  it('should insert data into the schema', async () => {
    const data = { name: 'test', age: Math.floor(Math.random() * 100) };
    const result = await cache.insert('test', data);
    delete result.id;
    expect(result).toEqual(data);
    const result1 = await cache.search('test', 'name', '{test}');
    expect(result1).toEqual([]);
  });
  it('should search the schema', async () => {
    const result = await cache.search('test', 'name', 'test');
    expect(result).toEqual([]);
  });
});
