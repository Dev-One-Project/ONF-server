import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { InvitationCodeService } from './invitationCode.service';

@Resolver()
export class InvitationCodeResolver {
  constructor(
    private readonly invitationCodeService: InvitationCodeService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String, { description: '초대코드 발송' })
  async sendCodeToEmail(
    @Args('email') email: string,
    @Args('memberId') memberId: string,
    @Context() context: IContext,
  ) {
    return await this.invitationCodeService.send({
      companyId: context.req.user.company,
      memberId,
      email,
    });
  }

  // @Mutation(() => String, { description: '초대코드 예약전송' })
  // async sendReservationCode(
  //   @Args('companyId') companyId: string, //
  //   @Args('memberId') memberId: string,
  //   @Args('email') email: string,
  //   @Args('date') date: Date,
  // ) {
  //   return await this.invitationCodeService.reservation({
  //     companyId,
  //     memberId,
  //     email,
  //     date,
  //   });
  // }

  @Mutation(() => String, { description: '초대코드 확인' })
  async checkInvitationCode(
    @Args('memberId') memberId: string, //
    @Args('invitationCode') invitationCode: string,
  ) {
    return await this.invitationCodeService.check({
      memberId,
      invitationCode,
    });
  }
}
