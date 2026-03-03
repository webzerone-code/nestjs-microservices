import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { UserContext } from './auth.types';
import { Public } from './public.decorator';
import { RegisterDto } from './dtos/register.dto';
import { UserDto } from './dtos/user.dto';
import { LoginDto } from './dtos/login.dto';

UseGuards(JwtAuthGuard);
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async me(@CurrentUser() user: UserContext): Promise<UserContext> {
    return user;
  }

  @Post('login')
  @Public()
  async login(@Body() user: LoginDto): Promise<UserDto> {
    try {
      return await this.authService.login(user);
    } catch (e) {
      throw new UnauthorizedException(e?.message || 'Invalid credentials');
    }
  }

  @Post('register')
  @Public()
  async register(@Body() user: RegisterDto): Promise<UserDto> {
    try {
      return await this.authService.register(user);
    } catch (e) {
      throw new UnauthorizedException(e?.message || 'Invalid credentials');
    }
  }
}
