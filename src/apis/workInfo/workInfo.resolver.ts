import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';
import { Role } from 'src/common/types/enum.role';
import { CreateBasicWorkInfoInput } from './dto/createBasickInfo.input';
import { CreateFixedLaborDaysInput } from './dto/createFixedLaborRule.input';
import { CreateMaximumLaberInput } from './dto/createMaximumLaborRule.input';
import { UpdateBasicWorkInfoInput } from './dto/updateBasickInfo.input';
import { UpdateFixedLaborDaysInput } from './dto/updateFixedLaborRule.input';
import { UpdateMaximumLaberInput } from './dto/updateMaximumLaborRule.input';
import { WorkInfo } from './entites/workInfo.entity';
import { WorkInfoService } from './workInfo.service';

@Resolver()
export class WorkInfoResolver {
  constructor(
    private readonly workInfoService: WorkInfoService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard, RolesGuard)
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

  @UseGuards(GqlAuthAccessGuard, RolesGuard)
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

  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [WorkInfo], { description: '회사기준 근로정보 조회' })
  fetchWorkInfos(
    @Context() context: IContext, //
  ) {
    return this.workInfoService.findWorkInfo({
      companyId: context.req.user.company,
    });
  }

  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => WorkInfo, { description: '맴버 근로정보 수정' })
  async updateWorkInfo(
    @Context() context: IContext, //
    @Args('email', { nullable: true }) email: string,
    @Args('memberId') memberId: string,
    @Args('updateBasicWorkInfoInput', { nullable: true })
    updateBasicWorkInfoInput: UpdateBasicWorkInfoInput,
    @Args('updateFixedLaborDaysInput', { nullable: true })
    updateFixedLaborDaysInput: UpdateFixedLaborDaysInput,
    @Args('updateMaximumLaberInput', { nullable: true })
    updateMaximumLaberInput: UpdateMaximumLaberInput,
  ) {
    return await this.workInfoService.updateWorkInfo({
      memberId,
      updateBasicWorkInfoInput,
      updateFixedLaborDaysInput,
      updateMaximumLaberInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => WorkInfo, { description: '회사 근로정보 삭제(완전삭제)' })
  async deleteCompanyWorkInfo(
    @Args('workInfoId') workInfoId: string, //
  ) {
    return this.workInfoService.deleteCompanyWorkInfo({
      workInfoId,
    });
  }
}
