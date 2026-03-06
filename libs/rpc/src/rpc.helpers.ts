import { RpcErrorPayload } from '@app/rpc/rpc.types';
import { RpcException } from '@nestjs/microservices';

export function rpcBadRequest(message: string, details?: any): never {
  const payload: RpcErrorPayload = { code: 'BAD_REQUEST', message, details };
  throw new RpcException(payload);
}

export function rpcNotFound(message: string, details?: any): never {
  const payload: RpcErrorPayload = { code: 'NOT_FOUND', message, details };
  throw new RpcException(payload);
}

export function rpcInternal(
  message: string = 'Internal error',
  details?: any,
): never {
  const payload: RpcErrorPayload = { code: 'INTERNAL', message, details };
  throw new RpcException(payload);
}

export function rpcUnauthorized(
  message: string = 'Unauthorized',
  details?: any,
): never {
  const payload: RpcErrorPayload = { code: 'UNAUTHORIZED', message, details };
  throw new RpcException(payload);
}

export function rpcForbidden(
  message: string = 'Forbidden',
  details?: any,
): never {
  const payload: RpcErrorPayload = { code: 'FORBIDDEN', message, details };
  throw new RpcException(payload);
}
