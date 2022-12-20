import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import { CreateNoticeBoardInput } from './dto/createNoticeBoardInput';
import { UpdateNoticeBoardInput } from './dto/updateNoticeBoardInput';
import { NoticeBoard } from './entities/noticeBoard.entity';
import { NoticeBoardService } from './noticeBoard.service';

@Resolver()
export class NoticeBoardResolver {
  constructor(
    private readonly noticeBoardService: NoticeBoardService, //
  ) {}

  @Query(() => [NoticeBoard])
  async fetchAllNoticeBoards() {
    return await this.noticeBoardService.findAll();
  }

  @Query(() => NoticeBoard)
  async fetchOneNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
  ) {
    return await this.noticeBoardService.findOne({ noticeBoardId });
  }

  // 일단 관리자가드가 만들어지기 전에 일반가드 씀 추후 교체
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => NoticeBoard)
  async createNoticeBoard(
    @Context() context: IContext, //
    @Args('createNoticeBoardInput')
    createNoticeBoardInput: CreateNoticeBoardInput, //
  ) {
    const user = context.req.email;

    return await this.noticeBoardService.create({
      user,
      createNoticeBoardInput,
    });
  }

  // 가드
  @Mutation(() => NoticeBoard)
  async updateNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
    @Args('updateNoticeBoardInput')
    updateNoticeBoardInput: UpdateNoticeBoardInput,
  ) {
    return await this.noticeBoardService.update({
      noticeBoardId,
      updateNoticeBoardInput,
    });
  }

  // 가드
  @Mutation(() => Boolean)
  async deleteNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
  ) {
    return await this.noticeBoardService.delete({ noticeBoardId });
  }
}
