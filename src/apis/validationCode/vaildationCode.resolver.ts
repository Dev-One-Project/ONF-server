import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import { ValidationCodeServcie } from './vaildationCode.service';

@Resolver()
export class ValidationCodeResolver {
  constructor(
    private readonly ValidationCodeService: ValidationCodeServcie, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { deprecationReason: '이메일 변경 인증코드발송' })
  async sendToValidationCode(
    @Context() context: IContext, //
    @Args('newEmail') newEmail: string,
  ) {
    return this.ValidationCodeService.send({
      newEmail,
      email: context.req.user.email,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { deprecationReason: '이메일 검증코드 확인' })
  async checkValidationCode(
    @Args('validationCode') validationCode: string, //
    @Context() context: IContext,
  ) {
    return this.ValidationCodeService.check({
      validationCode,
      email: context.req.user.email,
    });
  }
}
