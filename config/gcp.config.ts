import { registerAs } from '@nestjs/config';

export default registerAs(
  'gcp',
  (): Record<string, any> => ({
    region: process.env?.GCP_REGION ?? '',
    accessKeyId: process.env?.GCP_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env?.GCP_SECRET_ACCESS_KEY ?? '',
  }),
);
