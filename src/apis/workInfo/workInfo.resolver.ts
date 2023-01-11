import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateBasicWorkInfoInput } from './dto/createBasickInfo.input';
import { CreateFixedLaborDaysInput } from './dto/createFixedLaborRule.input';
import { CreateMaximumLaberInput } from './dto/createMaximumLaborRule.input';
import { WorkInfo } from './entites/workInfo.entity';
import { WorkInfoService } from './workInfo.service';

@Resolver()
export class WorkInfoResolver {
  constructor(
    private readonly workInfoService: WorkInfoService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => WorkInfo, { description: '근로정보 만들기' })
  async createWorkInfo(
    @Context() context: IContext, //
    @Args('createBasicWorkInfoInput', {
      nullable: true,
      description: '근로정보 기본정보 입력',
    })
    createBasicWorkInfoInput: CreateBasicWorkInfoInput,
    @Args('createFixedLaborDaysInput', {
      nullable: true,
      description: '근로정보 소정근로규칙 입력',
    })
    createFixedLaborDaysInput: CreateFixedLaborDaysInput,
    @Args('createMaximumLaberInput', {
      nullable: true,
      description: '근로정보 최대근로규칙 입력',
    })
    createMaximumLaberInput: CreateMaximumLaberInput,
  ) {
    return await this.workInfoService.createWorkInfo({
      companyId: context.req.user.company,
      createBasicWorkInfoInput,
      createFixedLaborDaysInput,
      createMaximumLaberInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => WorkInfo, { description: '맴버에게 근로정보 부여' })
  async insertWorkInfo(
    @Args('email') email: string, //
    @Args('name') name: string,
    @Context() context: IContext,
  ) {
    return await this.workInfoService.insertWorkInfo({
      email,
      name,
      companyId: context.req.user.company,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Roles(Role.ADMIN)
  @Query(() => [WorkInfo], { description: '회사기준 근로정보 조회' })
  fetchWorkInfos(
    @Context() context: IContext, //
  ) {
    return this.workInfoService.findWorkInfo({
      companyId: context.req.user.company,
    });
  }
}
