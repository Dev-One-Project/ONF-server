import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entites/account.entity';
import { NoticeBoard } from './entities/noticeBoard.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class NoticeBoardService {
  constructor(
    @InjectRepository(NoticeBoard)
    private readonly noticeBoardRepository: Repository<NoticeBoard>, //

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll({ userId }) {
    const account = await this.accountRepository.findOne({
      relations: {
        company: true,
      },
      where: { id: userId },
    });

    return await this.noticeBoardRepository
      .createQueryBuilder('noticeBoard')
      .leftJoinAndSelect('noticeBoard.account', 'account')
      .leftJoinAndSelect('noticeBoard.company', 'company')
      .where('company.id = :id', { id: account.company.id })
      .orderBy('noticeBoard.createdAt', 'DESC')
      .getMany();
  }

  async findOne({ noticeBoardId }) {
    return await this.noticeBoardRepository.findOne({
      where: { id: noticeBoardId },
      relations: {
        account: true,
      },
    });
  }

  async create({ userId, createNoticeBoardInput }) {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    const company = await this.companyRepository.findOne({
      where: { id: account.company.id },
    });

    return await this.noticeBoardRepository.save({
      ...createNoticeBoardInput,
      account,
      company,
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
