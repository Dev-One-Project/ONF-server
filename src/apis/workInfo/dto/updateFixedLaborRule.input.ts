import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFixedLaborDaysInput } from './createFixedLaborRule.input';

@InputType()
export class UpdateFixedLaborDaysInput extends PartialType(
  CreateFixedLaborDaysInput,
) {}
