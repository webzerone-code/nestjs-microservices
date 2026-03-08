import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'media';
  const logger = new Logger('MediaBootstrap');
  const port: number = Number(process.env.MEDIA_TCP_PORT ?? 4013);
  const rmqUrl: string =
    process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672';
  const queue: string = process.env.MEDIA_QUEUE ?? 'media_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     host: '0.0.0.0',
    //     port,
    //     // tlsOptions: {
    //     //   key: fs.readFileSync('path/to/key.pem'),
    //     //   cert: fs.readFileSync('path/to/cert.pem'),
    //     // },
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();

        // Send a clean object back to the Gateway
        return new RpcException({
          statusCode: 400,
          message: messages,
        });
      },
    }),
  );
  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Media microservice (RMQ) port ${queue}`);
}
bootstrap();
