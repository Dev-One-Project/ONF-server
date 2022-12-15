import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { getEmailTemplate } from 'src/common/libraries/utils';
import { Repository } from 'typeorm';
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
  ) {}

  async send({ companyId, memberId, email }) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    // TODO : 이메일 검증 추가

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    const admin = await this.memberRepository.findOne({
      where: { company: { id: companyId }, isAdmin: true },
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

    if (isCode.invitationCode) {
      const template = getEmailTemplate(company.name, isCode.invitationCode);

      await transporter
        .sendMail({
          from: EMAIL_SENDER,
          to: email,
          subject: `${admin.name}님이 ${company.name}에 초대하였습니다.`,
          html: template,
        })
        .then((send) => console.log(send))
        .catch((err) => console.log(err));

      return '재전송완료';
    } else {
      await transporter
        .sendMail({
          from: EMAIL_SENDER,
          to: email,
          subject: `${admin.name}님이 ${company.name}에 초대하였습니다.`,
          html: template,
        })
        .then((send) => console.log(send))
        .catch((err) => console.log(err));

      await this.invitationCodeRepository.save({
        member: memberId,
        compnay: companyId,
        invitationCode: code,
      });

      await this.memberRepository.update(
        { id: memberId },
        { inivitationCode: code },
      );

      return '전송완료';
    }
  }

  async check({ memberId, invitationCode }) {
    const saveCode = await this.invitationCodeRepository.findOne({
      where: { member: memberId },
    });

    if (saveCode.invitationCode !== invitationCode) {
      throw new ConflictException('초대코드가 일치하지 않습니다.');
    }

    await this.memberRepository.update({ id: memberId }, { isJoin: true });

    await this.invitationCodeRepository.delete({ id: memberId });

    return '합류완료';
  }
}
