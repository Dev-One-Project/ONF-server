import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';

@Module({
  imports: [],
  providers: [
    MemberResolver, //
    MemberService,
  ],
})
export class MemberModule {}
