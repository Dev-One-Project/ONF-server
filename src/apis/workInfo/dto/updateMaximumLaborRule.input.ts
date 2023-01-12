import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMaximumLaberInput } from './createMaximumLaborRule.input';

@InputType()
export class UpdateMaximumLaberInput extends PartialType(
  CreateMaximumLaberInput,
) {}
