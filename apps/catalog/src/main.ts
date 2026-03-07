import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('CatalogBootstrap');
  const port: number = Number(process.env.CATALOG_TCP_PORT ?? 4011);

  const rmqUrl: string =
    process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672';
  const queue: string = process.env.CATALOG_QUEUE ?? 'catalog_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
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

  //applyToMicroservice(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen();
  logger.log(`Catalog microservice (RMQ) port ${queue}`);
}
bootstrap();
