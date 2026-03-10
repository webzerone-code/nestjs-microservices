import { Module } from '@nestjs/common';
import { EventsGateway } from './events-gateway';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt-config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.jwt.secretKey,
        signOptions: {
          expiresIn: config.jwt.expiresIn,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class EventsModule {}
