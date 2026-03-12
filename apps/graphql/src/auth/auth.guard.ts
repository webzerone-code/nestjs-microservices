import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const req: any = gqlCtx?.req ?? context.switchToHttp().getRequest();
    if (!req || !req.headers)
      throw new UnauthorizedException('Request context is unavailable');

    const authorization: any = req.headers.authorization;
    if (!authorization || typeof authorization !== 'string')
      throw new UnauthorizedException('Missing Authorization header');

    const token = authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length).trim()
      : '';
    if (!token) throw new UnauthorizedException('Invalid token');
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      req.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
