import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { InvitationCode } from '../invitationCode/entities/invitationCode.entity';
import { InvitationCodeService } from '../invitationCode/invitationCode.service';
import { Member } from '../members/entities/member.entity';
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
    private readonly invitationRepository: Repository<InvitationCode>,

    private readonly invitaionCodeSerivce: InvitationCodeService,

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

      const companyData: Company = this.companyRepository.create({
        name: createCompanyInput.name,
        logoUrl: createCompanyInput.logoUrl,
        rules: createCompanyInput.rules,
        membership: createCompanyInput.membership,
      });

      const company: Company = await queryRunner.manager.save(
        Company,
        companyData,
      );

      const joinDate: Date = company.createdAt;

      const memberData = this.memberRepository.create({
        name: '최고관리자',
        phone,
        isJoin: true,
        company: { id: company.id },
        joinDate: joinDate,
      });

      const member: Member = await queryRunner.manager.save(Member, memberData);

      const adminAccount: Account = this.accountRepository.create({
        email,
        name,
        password,
        phone,
        company,
        member,
      });

      const result: Account = await queryRunner.manager.save(
        Account,
        adminAccount,
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createEmployee({
    email,
    hashedPassword: password,
    name,
    phone,
    memberId,
    invitationCode,
  }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.accountRepository.findOne({ where: { email } });
      if (user) throw new ConflictException('이미 등록된 이메일입니다.');
      console.log(user);
      const code = await this.invitationRepository.findOne({
        where: { member: { id: memberId } },
        relations: {
          member: true,
        },
      });

      if (code.invitationCode !== invitationCode)
        throw new ConflictException('초대코드가 일치하지 않습니다.');
      const isJoin = this.memberRepository.create({
        ...code.member,
        isJoin: true,
      });

      await queryRunner.manager.save(Member, isJoin);

      const member: Member = await this.memberRepository.findOne({
        where: {
          id: memberId,
        },
        relations: {
          company: true,
        },
      });

      const createEmployee: Account = this.accountRepository.create({
        email,
        password,
        name,
        phone,
        member: { id: memberId },
        company: { id: member.company.id },
      });

      const result = await queryRunner.manager.save(Account, createEmployee);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
