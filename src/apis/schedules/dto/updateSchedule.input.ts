import { InputType, PartialType } from '@nestjs/graphql';
import { CreateScheduleInput } from './createSchedule.input';

@InputType()
export class UpdateScheduleInput extends PartialType(CreateScheduleInput) {}
