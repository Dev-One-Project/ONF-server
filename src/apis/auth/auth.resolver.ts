import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AccountService } from '../accounts/account.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/common/types/context';
import { GqlAuthRefreshGuard } from 'src/common/auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly accountService: AccountService, //
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const user = await this.accountService.findOne({ email });

    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    this.authService.setRefreshToken({
      user,
      res: context.res,
      req: context.req,
    });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async restoreAccessToken(
    @Context() context: IContext, //
  ) {
    console.log('context.req.user from resolver : ', context.req.user);
    const user = await this.accountService.findDetail({
      userId: context.req.user.id,
    });

    this.authService.setRefreshToken({
      user: context.req.user,
      res: context.res,
      req: context.req,
    });
    return this.authService.getAccessToken({ user });
  }
}
