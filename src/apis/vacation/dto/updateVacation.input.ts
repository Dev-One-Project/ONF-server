import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVacationInput } from './createVacation.input';

@InputType()
export class UpdateVacationInput extends PartialType(
  CreateVacationInput, //
) {}
