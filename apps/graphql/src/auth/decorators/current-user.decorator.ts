import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const request = gqlContext?.req;
    const user = request?.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request context');
    }

    return data ? user?.[data] : user;
  },
);
