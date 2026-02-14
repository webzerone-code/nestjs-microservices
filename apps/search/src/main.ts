import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('SearchBootstrap');
  const port: number = Number(process.env.SEARCH_TCP_PORT ?? 4012);
  const rmqUrl: string =
    process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672';
  const queue: string = process.env.SEARCH_QUEUE ?? 'search_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     host: '0.0.0.0',
    //     port,
    //   },
    // },
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: { durable: false },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Search microservice (TCP) port ${queue}`);
}
bootstrap();
