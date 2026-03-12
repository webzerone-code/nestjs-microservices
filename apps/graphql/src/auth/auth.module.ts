import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'relationOne'),
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
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
