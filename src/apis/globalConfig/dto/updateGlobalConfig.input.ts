import { InputType, OmitType } from '@nestjs/graphql';
import { CreateGlobalConfigInput } from './createGlobalConfig.input';

@InputType()
export class UpdateGlobalConfigInput extends OmitType(
  CreateGlobalConfigInput,
  ['companyId'],
  InputType,
) {}
