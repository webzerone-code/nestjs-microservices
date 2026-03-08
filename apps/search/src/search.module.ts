import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from '../config/mongo-config';
import {
  SearchProduct,
  SearchProductSchema,
} from './search/search-index-schema';

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
    MongooseModule.forFeature([
      { name: SearchProduct.name, schema: SearchProductSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
