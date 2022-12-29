import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InvitationCodeService } from './invitationCode.service';

@Resolver()
export class InvitationCodeResolver {
  constructor(
    private readonly invitationCodeService: InvitationCodeService, //
  ) {}

  @Mutation(() => String, { description: '초대코드 발송' })
  async sendCodeToEmail(
    @Args('companyId') companyId: string, //
    @Args('memberId') memberId: string,
    @Args('email') email: string,
  ) {
    return await this.invitationCodeService.send({
      companyId,
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
