import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dtos/user.dto';
import { UserModule } from '../users/user.module';
import { User, UserDocument } from '../users/user.schema';
import { HydratedDocument } from 'mongoose';
import { LoginDto } from './dtos/login.dto';
import { ulid } from 'ulid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async verifyAndBuildContext(
    token: string,
  ): Promise<{ userId: string; email: string; role: string }> {
    try {
      const payload: { userId: string; email: string; role: string } =
        await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Invalid token');
    }
  }

  async login(input: LoginDto): Promise<UserDto> {
    const { email, password } = input;
    const existingUser = await this.userService.findByUserByEmail(email);
    if (!existingUser) throw new UnauthorizedException('Invalid credentials');

    const isMatch =
      (await bcrypt.compare(password, existingUser.password)) ?? false;
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payLoad: UserDto = {
      userId: existingUser.userId,
      email,
      name: existingUser.name,
      accessToken: null,
    };
    return await this.generateToken(payLoad);
  }
  async register(input: RegisterDto): Promise<UserDto> {
    const { email, name, password } = input;
    const existingUser = await this.userService.findByUserByEmail(email);
    if (existingUser) throw new UnauthorizedException('User already exists');

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: HydratedDocument<User> =
        await this.userService.upsertAuthUser({
          userId: ulid(),
          email,
          name,
          password: hashedPassword,
        });
      const payLoad: UserDto = {
        userId: user.userId,
        email,
        name,
        accessToken: null,
      };
      return await this.generateToken(payLoad);
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async generateToken(user: UserDto): Promise<UserDto> {
    const tokenPayload = {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
    const accessToken: string = await this.jwtService.sign(tokenPayload);
    return {
      accessToken,
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }
}
