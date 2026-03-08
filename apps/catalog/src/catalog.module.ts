import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from '../config/mongo-config';
import { Product, ProductSchema } from './products/product.schema';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventsPublisher } from './events/product-events.publisher';

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
    ClientsModule.register([
      {
        name: 'SEARCH_EVENTS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672',
          ],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [CatalogController, ProductsController],
  providers: [CatalogService, ProductsService, ProductEventsPublisher],
})
export class CatalogModule {}
