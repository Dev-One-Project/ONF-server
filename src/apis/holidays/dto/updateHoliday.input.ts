import { InputType, PartialType } from '@nestjs/graphql';
import { CreateHolidayInput } from './createHoliday.input';

@InputType()
export class UpdateHolidayInput extends PartialType(CreateHolidayInput) {}
