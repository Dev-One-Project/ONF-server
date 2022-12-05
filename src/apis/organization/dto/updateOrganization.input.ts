import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOrganizationInput } from './createOrganization.input';

@InputType()
export class UpdateOrganizationInput extends PartialType(
  CreateOrganizationInput,
) {}
