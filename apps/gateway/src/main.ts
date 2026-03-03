import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  process.title = 'gateway';
  const logger = new Logger('GatewayBootstrap');

  const app = await NestFactory.create(GatewayModule);
  app.enableShutdownHooks();
  const port = Number(process.env.GATWAY_PORT ?? 3000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  logger.log(`Gateway listening on port ${port}`);
}
bootstrap();
