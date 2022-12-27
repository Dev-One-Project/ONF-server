import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../types/enum.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(
      'roles', //
      [context.getHandler(), context.getClass()],
    );
    // console.log('what is roles?', roles);
    if (!roles) return true;

    const gqlContext =
      GqlExecutionContext.create(context).getContext().req.user;

    return roles.some((role) => gqlContext.role.includes(role));
  }
}
