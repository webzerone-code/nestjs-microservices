import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../config/jwt-config';
import { ConfigType } from '@nestjs/config';

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
  providers: [UserResolver, UserService],
})
export class UserModule {}
