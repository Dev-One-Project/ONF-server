import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateHolidayInput } from './dto/createHoliday.input';
import { UpdateHolidayInput } from './dto/updateHoliday.input';
import { Holiday } from './enties/holiday.entity';
import { HolidayService } from './holiday.service';
import { Roles } from 'src/common/auth/roles.decorator';
import { Role } from 'src/common/types/enum.role';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { IContext } from 'src/common/types/context';

@Resolver()
export class HolidayResolver {
  constructor(
    private readonly holidayService: HolidayService, //
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Holiday, {
    description: 'Create Holiday such as company founding anniversary',
  })
  createHoliday(
    @Context() context: IContext,
    @Args('createHolidayInput') createHolidayInput: CreateHolidayInput, //
  ) {
    return this.holidayService.create({
      createHolidayInput,
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String, { description: 'Create holidays such as "설날"' })
  async createHolidays() {
    await this.holidayService.holiday();
    return '공휴일을 추가하였습니다.';
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Holiday], {
    description: 'Fetch Holiday such as companyAnniversary',
  })
  fetchHoliday(@Context() context: IContext) {
    return this.holidayService.findCompnayHoliday({
      companyId: context.req.user.company,
    });
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Holiday], { description: 'Fetch Holidays in ASC order' })
  fetchHolidays() {
    return this.holidayService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
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
