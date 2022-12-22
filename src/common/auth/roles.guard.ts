import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

// const matchRoles = (roles: string[], userRoles: string) => {
//   return roles.some((role) => role === userRoles);
// };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('역할는?:', roles);

    if (!roles) {
      return true;
    }

    const { user } = ctx.getContext().req;
    const result = roles.some((role) => user.role?.includes(role));
    console.log(result);
    return result;

    const roleExpected = roles[0]; // admin
    const userRole = GqlExecutionContext.create(context).getContext();
    // const gqlContext = GqlExecutionContext.create(context);
    // const req = gqlContext.getContext().req;
    // const user = req.user;
    console.log('유저테스트:', userRole.user);
    // console.log(roleExpected);
    if (!(userRole === roleExpected)) {
      return false;
    }

    return true;

    // const roles = this.reflector.getAllAndOverride<string[]>('roles', [
    //   context.getHandler(),
    // ]);
    // console.log(roles);
    // if (!roles) return true;
    // const user = request.getContext().req.user;
    // if (!user) {
    //   throw new ForbiddenException('User does not exist');
    // }
    // console.log('RolesGuard Test: ', request, user);
    // const result = matchRoles(roles, user.role);
    // console.log('Role Guard Test: ', result, user);
    // return request;
  }
}
