---
sidebar_position: 3
title: Redis Cache 
---
# Redis Cache

### Power and Usefulness

Redis is an in-memory data structure store, widely used as a database, cache, and message broker. The Redis Cache Package allows developers to leverage Redis's speed and efficiency for data storage and retrieval in their applications.

1. **Performance**: Redis operates in memory, providing extremely fast read and write operations, which is crucial for applications requiring low latency.

2. **Scalability**: With support for clustering and partitioning, Redis can handle large volumes of data and high traffic loads, making it suitable for scalable applications.

3. **Data Structures**: Redis supports various data types such as strings, hashes, lists, sets, and sorted sets, allowing for flexible data modeling.

4. **Persistence**: While primarily an in-memory store, Redis offers options for data persistence, ensuring that data is not lost in case of a server restart.

5. **Pub/Sub Messaging**: Redis includes a publish/subscribe messaging paradigm, enabling real-time messaging between different parts of an application.

6. **Ease of Use**: The Redis Cache Package simplifies the integration of Redis into your Mercury application, providing straightforward methods for common operations like setting, getting, and deleting data.

By utilizing the Redis Cache Package, developers can enhance their application's performance, scalability, and overall user experience.

## Usage

### Connecting to Redis

You can connect to a local or remote Redis instance using the following configurations:

#### Local Redis Connection

```javascript
await mercury.package([redisCache()]);
```

#### Remote Redis Connection

```javascript
await mercury.package([
  redisCache({
    client: {
      socket: { tls: true },
      url: process.env.REDIS_URL,
    },
  }),
]);
```
## Methods

### `set(key: string, value: string)`

Stores a value in Redis under the specified key.

### `get(key: string)`

Retrieves the value associated with the specified key.

### `delete(key: string)`

Deletes the specified key from Redis.

### `createSchema(name: string, fields: object, options: any)`

Creates a schema in Redis for structured data storage.

### `insert(name: string, data: any)`

Inserts data into Redis under the specified schema name.

### `search(name: string, query: string)`

Searches for data in Redis based on the specified query.

## Error Handling

The Redis client will log errors to the console. Ensure that your Redis instance is running and accessible.

## Conclusion

This documentation will be updated with more comprehensive information soon. For now, you can use the above methods to interact with Redis in your Mercury application.

## Additional Notes

- Ensure that the Redis server is properly configured and running.
- Use environment variables to manage sensitive information like Redis URLs.
- Consider implementing additional error handling as needed for production environments.