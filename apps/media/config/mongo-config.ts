import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  mongoUrlConnection: {
    url:
      process.env.MONGO_URI ??
      (() => {
        throw new Error('MONGO_URI missing');
      })(),
  },
}));
