import { registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export default registerAs('jwt', () => ({
  jwt: {
    secretKey:
      process.env.JWTSECRET ??
      (() => {
        throw new Error('JWTSECRET missing');
      })(),
    expiresIn:
      (process.env.JWTEXPIRESIN as StringValue) ??
      (() => {
        throw new Error('JWTEXPIRESIN missing');
      })(),
  },
}));
