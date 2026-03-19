import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Profile } from '../entities/profile.entity';
import { Tag } from '../entities/tag.entity';
import { InitialSchema1773879705013 } from '../migrations/1773879705013-initial-schema';
import { Generated1773883873834 } from '../migrations/1773883873834-generated';
import { SeederOptions } from 'typeorm-extension';

config();
const configService = new ConfigService();
const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [User, Post, Profile, Tag],
  migrations: [InitialSchema1773879705013, Generated1773883873834],

  // 2. These now work because of SeederOptions
  seeds: ['src/seeding/seed/**/*.ts'], // Try relative to project root
  factories: ['src/seeding/factory/**/*.ts'],
};

// 3. Export the DataSource
export default new DataSource(options);
