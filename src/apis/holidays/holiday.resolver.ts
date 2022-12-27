import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateHolidayInput } from './dto/createHoliday.input';
import { UpdateHolidayInput } from './dto/updateHoliday.input';
import { Holiday } from './enties/holiday.entity';
import { HolidayService } from './holiday.service';

@Resolver()
export class HolidayResolver {
  constructor(
    private readonly holidayService: HolidayService, //
  ) {}

  @Mutation(() => Holiday, {
    description: 'Create Holiday such as company founding anniversary',
  })
  createHoliday(
    @Args('companyId') companyId: string,
    @Args('createHolidayInput') createHolidayInput: CreateHolidayInput, //
  ) {
    return this.holidayService.create({ createHolidayInput });
  }

  @Mutation(() => String, { description: 'Create holidays such as "설날"' })
  async createHolidays() {
    await this.holidayService.holiday();
    return '공휴일을 추가하였습니다.';
  }

  @Query(() => [Holiday], {
    description: 'Fetch Holiday such as companyAnniversary',
  })
  fetchHoliday(
    @Args('companyId') companyId: string, //
  ) {
    return this.holidayService.findCompnayHoliday({ companyId });
  }

  @Query(() => [Holiday], { description: 'Fetch Holidays in ASC order' })
  fetchHolidays() {
    return this.holidayService.findAll();
  }

  @Mutation(() => Holiday)
  updateHoliday(
    @Args('holidayId') holidayId: string, //
    @Args('updateHolidayInput') updateHolidayInput: UpdateHolidayInput,
  ) {
    return this.holidayService.updateCompnayHoliday({
      holidayId,
      updateHolidayInput,
    });
  }
}
