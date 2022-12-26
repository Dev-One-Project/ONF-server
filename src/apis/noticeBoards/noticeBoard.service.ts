import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { NoticeBoard } from './entities/noticeBoard.entity';

@Injectable()
export class NoticeBoardService {
  constructor(
    @InjectRepository(NoticeBoard)
    private readonly noticeBoardRepository: Repository<NoticeBoard>, //

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll() {
    return await this.noticeBoardRepository.find({
      relations: {
        account: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne({ noticeBoardId }) {
    return await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId },
      relations: {
        account: true,
      },
    });
  }

  async create({ accountId, createNoticeBoardInput }) {
    // const userId = await this.accountRepository.findOne({
    //   where: { email: user },
    // });

    return await this.noticeBoardRepository.save({
      ...createNoticeBoardInput,
      //  account: { id: userId.id },
      account: { id: accountId },
    });
  }

  async update({ noticeBoardId, updateNoticeBoardInput }) {
    const origin = await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId },
    });

    return await this.noticeBoardRepository.save({
      ...origin,
      id: noticeBoardId,
      ...updateNoticeBoardInput,
    });
  }

  async delete({ noticeBoardId }) {
    const result = await this.noticeBoardRepository.softDelete({
      id: noticeBoardId,
    });

    return result.affected ? true : false;
  }
}
