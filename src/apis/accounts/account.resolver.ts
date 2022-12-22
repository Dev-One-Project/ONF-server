import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './entites/account.entity';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';

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
    const result = await this.accountService.findOne({ email });
    console.log(result);
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => Account)
  async fetchAccounts(@Context() context: IContext) {
    const email = context.req.user.email;
    return await this.accountService.findOne({ email });
  }
}
