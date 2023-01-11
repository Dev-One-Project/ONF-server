import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodRange, Standard } from 'src/common/types/enum.range';
import { Role } from 'src/common/types/enum.role';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { GlobalConfig } from '../globalConfig/entities/globalConfig.entity';
import { InvitationCode } from '../invitationCode/entities/invitationCode.entity';
import { Member } from '../members/entities/member.entity';
import { WorkInfo } from '../workInfo/entites/workInfo.entity';
import { Account } from './entites/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(InvitationCode)
    private readonly invitationCodeRepository: Repository<InvitationCode>,

    @InjectRepository(GlobalConfig)
    private readonly globalConfigRepository: Repository<GlobalConfig>,

    @InjectRepository(WorkInfo)
    private readonly workInfoRepository: Repository<WorkInfo>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne({ email }) {
    return await this.accountRepository.findOne({
      where: {
        email, //
      },
      relations: {
        member: true,
        company: true,
      },
    });
  }

  async findByCompanyId({ companyId }) {
    return await this.accountRepository.find({
      where: {
        companyId,
      },
    });
  }

  async findDetail({ userId }) {
    return await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.member', 'member')
      // .leftJoinAndSelect('account.company', 'company')
      .where('account.id = :userId', { userId })
      .getOne();
  }

  async createAdmin({
    email,
    hashedPassword: password,
    name,
    phone,
    createCompanyInput,
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(Account, {
        where: { email },
      });

      if (user) throw new ConflictException('이미 등록된 이메일입니다.');
      const companyInput: Company = { ...createCompanyInput };
      const companyData: Company = this.companyRepository.create({
        ...companyInput,
      });
      // console.log('1번테스트', companyData);
      const company: Company = await queryRunner.manager.save(
        Company,
        companyData,
      );
      console.log('2번테스트', company);
      const joinDate: Date = company.createdAt;

      const workInfoData: WorkInfo = this.workInfoRepository.create({
        fixedStandard: Standard.WEEK,
        fixedPeriodRange: PeriodRange.WEEK,
        maximumStandard: Standard.WEEK,
        maximumPeriodRange: PeriodRange.WEEK,
        name: '일반근무',
        fixedLabor: '월화수목금',
        weekOffDays: '일',
        fixedHours: '40',
        fixedUnitPeriod: '1',
        maximumHours: '52',
        maximumUnitPeriod: '1',
        companyId: company.id,
      });

      const workInfo: WorkInfo = await queryRunner.manager.save(
        WorkInfo,
        workInfoData,
      );
      console.log('아이디확인', workInfo);

      queryRunner.manager.update(
        WorkInfo,
        { company },
        { company: { id: company.id } },
      );

      const globalData: GlobalConfig = this.globalConfigRepository.create({
        allowedCheckInBefore: 10,
        allowedCheckInAfter: 12,
        isWorkLogEnabled: false,
        isVacationEnabled: false,
        isScheduleEnabled: false,
        isCheckInEnabled: false,
        isCheckOutEnabled: false,
        company: { id: company.id },
      });

      const globalConfig = await queryRunner.manager.save(
        GlobalConfig,
        globalData,
      );

      await queryRunner.manager.update(
        Company,
        { id: globalConfig.company.id },
        { globalConfig: { id: globalConfig.id } },
      );

      const memberData = this.memberRepository.create({
        name: '최고관리자',
        phone,
        isJoin: true,
        company: { id: company.id },
        joinDate: joinDate,
      });
      // console.log('3번테스트', memberData);
      const member: Member = await queryRunner.manager.save(Member, memberData);
      // console.log('4번테스트', member);

      const adminAccount: Account = this.accountRepository.create({
        email,
        name,
        password,
        phone,
        companyId: company.id,
        member,
        roles: Role.ADMIN,
      });
      // console.log('5번테스트', adminAccount);

      const result: Account = await queryRunner.manager.save(
        Account,
        adminAccount,
      );

      const { account } = company;

      await queryRunner.manager.save(Company, {
        ...company,
        account: { id: result.id },
      });
      // console.log('6번테스트', result);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }

  async createEmployee({
    email,
    hashedPassword: password,
    name,
    phone,
    invitationCode,
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.accountRepository.findOne({ where: { email } });
      if (user) throw new ConflictException('이미 등록된 이메일입니다.');

      const code = await this.invitationCodeRepository.findOne({
        where: { invitationCode },
        relations: {
          member: true,
          company: true,
        },
      });

      // console.log('여기도 같이 돌아가나요?', code);

      if (!code) throw new NotFoundException('초대코드가 일치하지 않습니다.');

      const isJoin = this.memberRepository.create({
        ...code.member,
        isJoin: true,
      });

      const member = await queryRunner.manager.save(Member, isJoin);
      // console.log('회사ID', code.company.id);
      const createEmployee: Account = this.accountRepository.create({
        email,
        password,
        name,
        phone,
        member,
        companyId: code.company.id,
      });

      // console.log('직원이 생성되나요?', createEmployee);
      const result = await queryRunner.manager.save(Account, createEmployee);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
      await this.invitationCodeRepository.delete({ invitationCode });
    }
  }
}
