import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  (): Record<string, any> => ({
    host: process.env?.REDIS_HOST ?? '127.0.0.1',
    port: process.env?.REDIS_PORT ?? '6379',
    ttl: 100000,
    max: 10000,
  }),
);
