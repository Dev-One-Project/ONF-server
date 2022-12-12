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
    return this.accountRepository.findOne({
      where: { email },
    });
  }

  async create({ email, hashedPassword: password }) {
    const user = await this.accountRepository.findOne({
      where: { email },
    });
    // console.log(user);
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    return await this.accountRepository.save({ email, password });
  }
}
