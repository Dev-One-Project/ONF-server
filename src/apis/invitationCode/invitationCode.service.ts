import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { checkEmail, getEmailTemplate } from 'src/common/libraries/utils';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { Company } from '../companies/entities/company.entity';
import { Member } from '../members/entities/member.entity';
import { InvitationCode } from './entities/invitationCode.entity';

@Injectable()
export class InvitationCodeService {
  constructor(
    @InjectRepository(InvitationCode)
    private readonly invitationCodeRepository: Repository<InvitationCode>, //

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async send({ companyId, memberId, email }) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    const admin = await this.accountRepository.findOne({
      where: { company: { id: companyId } },
      relations: {
        member: true,
      },
    });

    const isCode = await this.invitationCodeRepository.findOne({
      where: { member: { id: memberId } },
    });

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const template = getEmailTemplate(company.name, code);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const validateEmail = checkEmail(email);
    if (!validateEmail) {
      throw new ConflictException('이메일 형식이 올바르지 않습니다');
    }

    if (isCode) {
      const template = getEmailTemplate(company.name, isCode.invitationCode);

      await transporter
        .sendMail({
          from: EMAIL_SENDER,
          to: email,
          subject: `${admin.member.name}님이 ${company.name}에 초대하였습니다.`,
          html: template,
        })
        .then((send) => console.log(send))
        .catch((err) => console.log(err));

      return '재전송완료';
    }

    await transporter
      .sendMail({
        from: EMAIL_SENDER,
        to: email,
        subject: `${admin.member.name}님이 ${company.name}에 초대하였습니다.`,
        html: template,
      })
      .then((send) => console.log(send))
      .catch((err) => console.log(err));

    await this.invitationCodeRepository.save({
      member: memberId,
      compnay: companyId,
      invitationCode: code,
    });

    return '전송완료';
  }

  // cron + mongodb
  // async reservation({ companyId, memberId, email, date }) {

  //   // const current = new Date();
  //   // current.setHours(current.getHours() + 9);

  //   // const time = date.getTime() - current.getTime();

  //   // setTimeout(() => {
  //   //   this.send({ companyId, memberId, email });
  //   // }, time);

  //   return '예약전송완료';
  // }

  async check({ memberId, invitationCode }) {
    const saveCode = await this.invitationCodeRepository.findOne({
      where: { member: { id: memberId } },
      relations: {
        member: true,
      },
    });

    if (saveCode.invitationCode !== invitationCode) {
      throw new ConflictException('초대코드가 일치하지 않습니다.');
    }

    await this.memberRepository.update({ id: memberId }, { isJoin: true });

    // await this.invitationCodeRepository.delete({ member: { id: memberId } });

    // TODO : account테이블에서 memberId 넣어줘야함 근데 어떻게?
    // await this.accountRepository.update

    return '합류완료';
  }
}
