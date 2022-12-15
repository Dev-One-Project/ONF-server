import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { InvitationCode } from './entities/invitationCode.entity';
import { InvitationCodeResolver } from './invitationCode.resolver';
import { InvitationCodeService } from './invitationCode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitationCode, //
      Member,
      Company,
    ]),
  ],
  providers: [
    InvitationCodeResolver, //
    InvitationCodeService,
  ],
})
export class InvitationCodeModule {}
