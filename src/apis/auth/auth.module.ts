import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/common/auth/jwt-social-google.stragegy';
import { JwtKakaoStrategy } from 'src/common/auth/jwt-social-kakao.stragegy';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/entites/account.entity';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';
import { InvitationCode } from '../invitationCode/entities/invitationCode.entity';
import { InvitationCodeService } from '../invitationCode/invitationCode.service';
import { Member } from '../members/entities/member.entity';
import { Organization } from '../organization/entities/organization.entity';
import { RoleCategory } from '../roleCategory/entities/roleCategory.entity';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), //
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
    JwtRefreshStrategy, //
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    AuthResolver,
    AuthService,
    AccountService,
    CompanyService,
    InvitationCodeService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
