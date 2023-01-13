import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkEmail, getNewEmailTemplate } from 'src/common/libraries/utils';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { ValidationCode } from './entities/vaildationCode.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ValidationCodeServcie {
  constructor(
    @InjectRepository(ValidationCode)
    private readonly validationCodeRepository: Repository<ValidationCode>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async send({ newEmail, email }) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    const account = await this.accountRepository.findOne({
      where: { email },
    });

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const template = getNewEmailTemplate(newEmail, code);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const validateEmail = checkEmail(newEmail);
    if (!validateEmail)
      throw new ConflictException('이메일 형식이 올바르지 않습니다.');
    // if (isCode) {
    //   const template = getEmailTemplate(company.name, isCode.invitationCode);

    //   await transporter
    //     .sendMail({
    //       from: EMAIL_SENDER,
    //       to: email,
    //       subject: `${admin.member.name}님이 ${company.name}에 초대하였습니다.`,
    //       html: template,
    //     })
    //     .then((send) => console.log(send))
    //     .catch((err) => console.log(err));

    //   return '재전송완료';
    // }

    await transporter
      .sendMail({
        from: EMAIL_SENDER,
        to: newEmail,
        subject: `이메일 변경 인증코드입니다.`,
        html: template,
      })
      .then((send) => console.log(send))
      .catch((err) => console.log(err));
    await this.validationCodeRepository.save({
      validationCode: code,
      email: account.email,
    });
    return '전송완료';
  }
  async check({ validationCode, email }) {
    const saveCode = await this.validationCodeRepository.findOne({
      where: { email },
    });
    if (saveCode.validationCode !== validationCode)
      throw new ConflictException('인증 코드가 일치하지 않습니다.');
    await this.validationCodeRepository.save({
      isValid: true,
    });
    return '인증코드 확인완료';
  }
}
