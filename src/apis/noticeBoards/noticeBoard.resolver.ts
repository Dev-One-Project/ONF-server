import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import { CreateNoticeBoardInput } from './dto/createNoticeBoardInput';
import { UpdateNoticeBoardInput } from './dto/updateNoticeBoardInput';
import { NoticeBoard } from './entities/noticeBoard.entity';
import { NoticeBoardService } from './noticeBoard.service';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { RolesGuard } from 'src/common/auth/roles.guard';

@Resolver()
export class NoticeBoardResolver {
  constructor(
    private readonly noticeBoardService: NoticeBoardService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [NoticeBoard], { description: '공지사항 게시글 전부 조회' })
  async fetchAllNoticeBoards(
    @Context() context: IContext, //
  ): Promise<NoticeBoard[]> {
    return await this.noticeBoardService.findAll({
      companyId: context.req.user.company,
    });
  }

  @Query(() => NoticeBoard, { description: '공지사항 게시글 단일 조회' })
  async fetchOneNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
  ): Promise<NoticeBoard> {
    return await this.noticeBoardService.findOne({ noticeBoardId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => NoticeBoard, { description: '공지사항 게시글 생성' })
  async createNoticeBoard(
    @Context() context: IContext,
    @Args('createNoticeBoardInput')
    createNoticeBoardInput: CreateNoticeBoardInput, //
  ): Promise<CreateNoticeBoardInput> {
    const userId = context.req.user.id;

    return await this.noticeBoardService.create({
      userId,
      createNoticeBoardInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => NoticeBoard, { description: '공지사항 게시글 수정' })
  async updateNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
    @Args('updateNoticeBoardInput')
    updateNoticeBoardInput: UpdateNoticeBoardInput,
  ): Promise<UpdateNoticeBoardInput> {
    return await this.noticeBoardService.update({
      noticeBoardId,
      updateNoticeBoardInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '공지사항 게시글 삭제' })
  async deleteNoticeBoard(
    @Args('noticeBoardId') noticeBoardId: string, //
  ): Promise<boolean> {
    return await this.noticeBoardService.delete({ noticeBoardId });
  }
}
