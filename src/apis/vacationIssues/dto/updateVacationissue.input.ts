import { InputType, PartialType } from '@nestjs/graphql';
import { parseType } from 'graphql';
import { CreateVacationIssueInput } from './createVacationissue.input';

@InputType()
export class UpdateVacationIssueInput extends PartialType(
  CreateVacationIssueInput, //
) {}
