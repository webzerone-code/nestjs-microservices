import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
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
}
