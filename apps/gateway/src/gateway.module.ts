import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigType } from '@nestjs/config';
import JwtConfig from '../config/jwt-config';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from '../config/mongo-config';
import PostgresConfig from '../config/postgres-config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [JwtConfig, MongoConfig, PostgresConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [MongoConfig.KEY],
      useFactory: (
        mongoConfig: ConfigType<typeof MongoConfig>,
      ): { uri: string } => ({
        uri: mongoConfig.mongoUrlConnection.url,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [PostgresConfig.KEY],
      useFactory: (pgConfig: ConfigType<typeof PostgresConfig>) => ({
        type: pgConfig.postgresConnection.type,
        url: pgConfig.postgresConnection.url,
        // optional:
        // synchronize: true,
        // autoLoadEntities: true,
      }),
    }),
    ClientsModule.register([
      {
        name: 'CATALOG_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URK ?? 'amqp://admin:admin@localhost:5672',
          ],
          queue: process.env.CATALOG_QUEUE ?? 'catalog_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'MEDIA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URK ?? 'amqp://admin:admin@localhost:5672',
          ],
          queue: process.env.MEDIA_QUEUE ?? 'media_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'SEARCH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URK ?? 'amqp://admin:admin@localhost:5672',
          ],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
