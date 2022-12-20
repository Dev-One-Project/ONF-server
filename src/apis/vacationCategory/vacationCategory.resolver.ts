import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVacationCategoryInput } from './dto/createVacationCategory.input';
import { UpdateVacationCategoryInput } from './dto/updateVacationCategory.input';
import { VacationCategory } from './entities/vacationCategory.entity';
import { VacationCategoryService } from './vacationCategory.service';

@Resolver()
export class VacationCategoryResolver {
  constructor(
    private readonly vacationCategoryService: VacationCategoryService,
  ) {}

  @Query(() => [VacationCategory], { description: '휴가유형 전체 찾기' })
  async fetchVacationCategorys(
    @Args('organizationid') organizationid: string, //
  ) {
    return await this.vacationCategoryService.findAll({ organizationid });
  }

  @Query(() => VacationCategory, {
    description: '휴가유형ID를 적어서 하나의 유형 찾기',
  })
  async fetchVacationCategory(
    @Args('vacationCategoryId') vacationCategoryId: string,
  ) {
    return await this.vacationCategoryService.findOne({ vacationCategoryId });
  }

  @Mutation(() => VacationCategory, { description: '휴가유형 만들기' })
  async createVacationCategory(
    @Args('createVacationCategoryInput')
    createVacationCategoryInput: CreateVacationCategoryInput,
  ) {
    return await this.vacationCategoryService.create({
      createVacationCategoryInput,
    });
  }

  @Mutation(() => VacationCategory, {
    description: '휴가유형Id와 Input을 적어 데이터 수정하기',
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

  @Mutation(() => Boolean, { description: '휴가유형ID로 데이터 완전 삭제하기' })
  deleteVacationCategory(
    @Args('vacationCategoryId') vacationCategoryId: string,
  ) {
    return this.vacationCategoryService.delete({ vacationCategoryId });
  }
}
