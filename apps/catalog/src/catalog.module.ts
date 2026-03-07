import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from '../config/mongo-config';
import { Product, ProductSchema } from './products/product.schema';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

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
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CatalogController, ProductsController],
  providers: [CatalogService, ProductsService],
})
export class CatalogModule {}
