import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'P88 Telegram Bot',
    env: process.env.ENV ?? 'dev',

    globalPrefix: '/api',
    http: {
      enable: process.env?.HTTP_ENABLE === 'true' ?? false,
      host: process.env?.HTTP_HOST ?? 'localhost',
      port: process.env?.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },
    telegram: {
      botToken: process.env?.TELEGRAM_BOT_TOKEN,
    },
    p88: {
      baseUrl: process.env?.P88_SERVICE_BASE_URL,
    },
    ai: {
      baseUrl: process.env?.AI_SERVICE_BASE_URL,
    },
    cors: {
      origin: process.env.APP_CORS_ORIGIN ?? '*',
      method: process.env.APP_CORS_METHOD ?? 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  }),
);
