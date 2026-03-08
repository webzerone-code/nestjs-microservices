import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import MongoConfig from '../config/mongo-config';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './media/media.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [MongoConfig] }),
    MongooseModule.forRootAsync({
      inject: [MongoConfig.KEY],
      useFactory: (
        mongoConfig: ConfigType<typeof MongoConfig>,
      ): { uri: string } => ({
        uri: mongoConfig.mongoUrlConnection.url,
      }),
    }),
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
