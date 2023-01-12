import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBasicWorkInfoInput } from './createBasickInfo.input';

@InputType()
export class UpdateBasicWorkInfoInput extends PartialType(
  CreateBasicWorkInfoInput,
) {}
