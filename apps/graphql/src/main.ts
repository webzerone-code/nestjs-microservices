import { NestFactory } from '@nestjs/core';
import { GraphqlModule } from './graphql.module';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GraphqlModule);
  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  const port = Number(process.env.GraphQLPort ?? 3600);
  await app.listen(port);
}
bootstrap();
//--packages.json under scripts
// "migration:generate": "npm run typeorm -- --dataSource=./apps/graphql/src/config/db.datasource.ts migration:generate",
// "migration:create": "typeorm migration:create",
// "migration:run": "npm run typeorm -- --dataSource=./apps/graphql/src/config/db.datasource.ts migration:run",
// "migration:revert": "npm run typeorm -- --dataSource=./apps/graphql/src/config/db.datasource.ts migration:revert"
//--- Command Lines
// Manual
//npm run migration:create ./apps/graphql/src/migrations/initial-schema
// generated
// npm run migration:generate ./apps/graphql/src/migrations/generated
