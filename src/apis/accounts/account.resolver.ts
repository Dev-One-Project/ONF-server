import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './entites/account.entity';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService, //
  ) {}

  @Mutation(() => Account)
  async createAccount(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.accountService.create({ email, hashedPassword });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Account)
  async fetchAccount(@Context() context: IContext) {
    const email = context.req.user.email;
    return await this.accountService.findOne({ email });
  }
}
