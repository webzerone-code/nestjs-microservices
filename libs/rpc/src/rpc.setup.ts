import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from '@app/rpc/rpc-exception.filter';

export function applyToMicroservice(app: INestMicroservice) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcExceptionFilter());
}
