import { InputType, PartialType } from '@nestjs/graphql';
import { CreateNoticeBoardInput } from './createNoticeBoardInput';

@InputType()
export class UpdateNoticeBoardInput extends PartialType(
  CreateNoticeBoardInput,
) {}
