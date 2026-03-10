import { NestFactory } from '@nestjs/core';
import { WebsocketsModule } from './websockets.module';

async function bootstrap() {
  const app = await NestFactory.create(WebsocketsModule);
  await app.listen(process.env.port ?? 3500);
}
bootstrap();
