import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Profile } from '../entities/profile.entity';
import { Tag } from '../entities/tag.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [User, Post, Profile, Tag],
  migrations: ['apps/graphql/src/migrations/*{.ts,.js}'],
  synchronize: false,
});
