import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from './entites/account.entity';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import { CreateCompanyInput } from '../companies/dto/createCompany.input';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService, //
  ) {}

  @Mutation(() => Account)
  async createAccount(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('phone', { nullable: true }) phone: string,
    @Args('createCompanyInput', { nullable: true })
    createCompanyInput?: CreateCompanyInput,
    @Args('invitationCode', { nullable: true })
    invitationCode?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!invitationCode) {
      return await this.accountService.createAdmin({
        email,
        hashedPassword,
        name,
        phone,
        createCompanyInput,
      });
    } else {
      return await this.accountService.createEmployee({
        email,
        hashedPassword,
        name,
        phone,
        invitationCode,
      });
    }
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Account)
  async fetchAccount(@Context() context: IContext) {
    const email = context.req.user.email;
    return await this.accountService.findOne({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Account], { description: 'Fetch Accounts by company & role' })
  async fetchAccounts(
    @Context() context: IContext, //
  ) {
    return await this.accountService.findByCompanyId({
      companyId: context.req.user.company,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Account, { description: '이름&휴대폰번호 수정' })
  changeAccount(
    @Context() context: IContext, //
    @Args('name', { nullable: true }) name: string,
    @Args('phone', { nullable: true }) phone: string,
  ) {
    return this.accountService.updateAccount({
      email: context.req.user.email,
      name,
      phone,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Account, { description: '이메일 수정' })
  async changeEmail(
    @Args('newEmail') newEmail: string, //
    @Args('password') password: string,
    @Context()
    context: IContext,
  ) {
    return this.accountService.updateEmail({
      oldEmail: context.req.user.email,
      newEmail,
      password,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '비빌번호 변경' })
  async changePassword(
    @Context() context: IContext, //
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
    @Args('checkPassword') checkPassword: string,
  ) {
    return await this.accountService.updatePassword({
      email: context.req.user.email,
      password,
      newPassword,
      checkPassword,
    });
  }
}
