import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './entites/account.entity';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/auth/gql-user.param';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';

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
    console.log(hashedPassword);
    return this.accountService.create({ email, hashedPassword });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Account)
  fetchAccount(
    @CurrentUser() currentUser: any, //
  ) {
    return currentUser;
  }
}
