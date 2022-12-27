import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entites/account.entity';
import { NoticeBoard } from './entities/noticeBoard.entity';
import { NoticeBoardResolver } from './noticeBoard.resolver';
import { NoticeBoardService } from './noticeBoard.service';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoticeBoard, //
      Account,
      Company,
    ]),
  ],
  providers: [
    NoticeBoardResolver, //
    NoticeBoardService,
  ],
})
export class NoticeBoardModule {}
