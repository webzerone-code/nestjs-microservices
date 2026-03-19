import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Profile } from '../entities/profile.entity';
import { Tag } from '../entities/tag.entity';
import { InitialSchema1773879705013 } from '../migrations/1773879705013-initial-schema';
import { Generated1773883873834 } from '../migrations/1773883873834-generated';

config();
const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [User, Post, Profile, Tag],
  migrations: [InitialSchema1773879705013, Generated1773883873834],
});
