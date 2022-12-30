import { InputType, PartialType } from '@nestjs/graphql';
import { CreateGlobalConfigInput } from './createGlobalConfig.input';

@InputType()
export class UpdateGlobalConfigInput extends PartialType(
  CreateGlobalConfigInput,
) {}
