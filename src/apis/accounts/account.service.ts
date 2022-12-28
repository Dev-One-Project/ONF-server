import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entites/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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

  async create({ email, hashedPassword: password, name, phone }) {
    const user = await this.accountRepository.findOne({
      where: { email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    return await this.accountRepository.save({ email, password, name, phone });
  }
}
