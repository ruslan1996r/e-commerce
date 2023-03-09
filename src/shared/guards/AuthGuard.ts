import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const graphCtx = GqlExecutionContext.create(context);
    const req = graphCtx.getContext().req;

    return req.session.user !== undefined;
  }
}
