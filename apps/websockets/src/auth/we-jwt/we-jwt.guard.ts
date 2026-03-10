import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WeJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;
    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers;
    const payload = this.validateToken(client);
    if (!payload) return false;
    client['user'] = payload;
    return true;
  }
  validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    const token: string | undefined = authorization?.split(' ')[1];
    if (!token) return null;
    const payload = this.jwtService.verify(token);
    return payload;
  }
}
