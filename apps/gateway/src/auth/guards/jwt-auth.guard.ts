import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../public.decorator';
import { REQUIRED_ROLE_KEY } from '../admin.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req: any = context.switchToHttp().getRequest();
    const authorization: any = req.headers.authorization; //req.headers['authorization'];
    if (!authorization || typeof authorization !== 'string')
      throw new UnauthorizedException('Missing Authorization header');

    const token = authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length).trim()
      : '';

    if (!token) throw new UnauthorizedException('Missing Token');
    const identifyAuthUser: { userId: string; email: string; role: string } =
      await this.authService.verifyAndBuildContext(token);

    req.user = identifyAuthUser;
    const requiredRole = this.reflector.getAllAndOverride<string>(
      REQUIRED_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRole && requiredRole !== identifyAuthUser.role)
      throw new ForbiddenException('Admin Access Required');
    return true;
  }
}
