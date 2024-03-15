import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    url: process.env?.MONGO_DB_HOST ?? 'localhost:27017',
    name: process.env?.MONGO_DB_NAME ?? 'game-database',
    user: process.env?.MONGO_DB_USER,
    password: process?.env.MONGO_DB_PASS,
  }),
);
