import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/roles.decorator';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { Role } from 'src/common/types/enum.role';
import { CreateVacationCategoryInput } from './dto/createVacationCategory.input';
import { UpdateVacationCategoryInput } from './dto/updateVacationCategory.input';
import { VacationCategory } from './entities/vacationCategory.entity';
import { VacationCategoryService } from './vacationCategory.service';

@Resolver()
export class VacationCategoryResolver {
  constructor(
    private readonly vacationCategoryService: VacationCategoryService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [VacationCategory], {
    description: '(관리자) 휴가유형 전체 찾기',
  })
  async fetchVacationCategorys() {
    return await this.vacationCategoryService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => VacationCategory, {
    description: '(관리자) 휴가유형ID를 적어서 하나의 유형 찾기',
  })
  async fetchVacationCategory(
    @Args('vacationCategoryId') vacationCategoryId: string,
  ) {
    return await this.vacationCategoryService.findOne({ vacationCategoryId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => VacationCategory, { description: '(관리자) 휴가유형 만들기' })
  async createVacationCategory(
    @Args('createVacationCategoryInput')
    createVacationCategoryInput: CreateVacationCategoryInput,
  ) {
    return await this.vacationCategoryService.create({
      createVacationCategoryInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => VacationCategory, {
    description: '(관리자) 휴가유형Id와 Input을 적어 데이터 수정하기',
  })
  async updateVacationCategory(
    @Args('vacationCategoryId') vacationCategoryId: string,
    @Args('updateVacationCategoryInput')
    updateVacationCategoryInput: UpdateVacationCategoryInput,
  ) {
    return await this.vacationCategoryService.update({
      vacationCategoryId,
      updateVacationCategoryInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => [VacationCategory], {
    description: '(관리자) 다수의 휴가유형 수정하기',
  })
  async updateManyVacationCategorys(
    @Args({ name: 'vacationCategoryId', type: () => [String] })
    vacationCategoryId: string[],
    @Args('updateVacationCategoryInput', { nullable: true })
    updateVacationCategoryInput: UpdateVacationCategoryInput,
  ) {
    return await this.vacationCategoryService.updateMany({
      vacationCategoryId,
      updateVacationCategoryInput,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, {
    description: '(관리자) 휴가유형ID로 데이터 완전 삭제하기',
  })
  async deleteVacationCategory(
    @Args('vacationCategoryId') vacationCategoryId: string,
  ) {
    return await this.vacationCategoryService.delete({ vacationCategoryId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean, { description: '(관리자) 다수의 휴가유형 삭제하기' })
  async deleteManyVacationCategory(
    @Args({ name: 'vacationCategoryId', type: () => [String] })
    vacationCategoryId: string[],
  ) {
    return await this.vacationCategoryService.deleteMany({
      vacationCategoryId,
    });
  }
}
