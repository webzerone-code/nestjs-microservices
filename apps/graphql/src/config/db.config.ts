import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';
import { Profile } from '../entities/profile.entity';

export default registerAs(
  'dbConfig.dev',
  (): PostgresConnectionOptions => ({
    url: process.env.POSTGRES_URL,
    type: 'postgres',
    entities: [User, Post, Profile, Tag],
    synchronize: false,
  }),
);
