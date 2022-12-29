import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';
import { InvitationCode } from '../invitationCode/entities/invitationCode.entity';
import { InvitationCodeService } from '../invitationCode/invitationCode.service';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { RoleCategoryService } from '../roleCategory/roleCategory.service';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Account } from './entites/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account, //
      Company,
      Member,
      RoleCategory,
      Organization,
      GlobalConfig,
      InvitationCode,
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    AccountResolver, //
    AccountService,
    CompanyService,
    RoleCategoryService,
    InvitationCodeService,
  ],
})
export class AccountModule {}
