import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  postgresConnection: {
    type: 'postgres' as const,
    url:
      process.env.POSTGRES_URL ??
      (() => {
        throw new Error('POSTGRES_URL missing');
      })(),
  },
}));
