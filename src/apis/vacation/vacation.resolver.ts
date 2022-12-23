import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVacationInput } from './dto/createVacation.input';
import { UpdateVacationInput } from './dto/updateVacation.input';
import { Vacation } from './entities/vacation.entity';
import { VacationService } from './vacation.service';

@Resolver()
export class VacationResolver {
  constructor(
    private readonly vacationService: VacationService, //
  ) {}

  @Query(() => [Vacation], { description: '(관리자) 휴가 전체 조회' })
  async fetchVacations(
    @Args('companyId') companyId: string, //
  ) {
    return await this.vacationService.findAll({ companyId });
  }

  @Query(() => [Vacation], { description: '(관리자) 기간 내 휴가 조회' })
  async fetchVacationWithDate(
    @Args('vacationStart') vacationStart: Date,
    @Args('vacationEnd') vacationEnd: Date,

  ) {
    return await this.vacationService.findVacationWithDate({
      vacationStart,
      vacationEnd,
    });
  }

  @Query(() => Vacation, { description: '(관리자) 휴가 ID를 통한 휴가 조회' })
  async fetchVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.findOne({ vacationId });
  }

  @Query(() => [Vacation], { description: '(관리자) 퇴사자와 함께 조회' })
  async fetchVacationWithDelete() {
    return await this.vacationService.findVacationWithDelete();
  }

  @Mutation(() => [Vacation], { description: '(관리자) 휴가관리 만들기' })
  async createVacation(
    @Args('createVacaionInput') createVacationInput: CreateVacationInput,
  ) {
    return await this.vacationService.create({ createVacationInput });
  }

  @Mutation(() => Vacation, { description: '(관리자) 휴가 수정하기' })
  async updateVacation(
    @Args('vacationId') vacationId: string,
    @Args('updateVacationInput') updateVacationInput: UpdateVacationInput,
  ) {
    return await this.vacationService.update({
      vacationId,
      updateVacationInput,
    });
  }

  @Mutation(() => Boolean, { description: '(관리자) 휴가 삭제 - DB에는 유지' })
  async softdeleteVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.softdelete({ vacationId });
  }

  @Mutation(() => Boolean, { description: '(관리자) 휴가 완전 삭제' })
  async deleteVacation(
    @Args('vacationId') vacationId: string, //
  ) {
    return await this.vacationService.delete({ vacationId });
  }
}
