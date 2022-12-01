import { InputType, PartialType } from '@nestjs/graphql';
import { CreateWorkCheckInput } from './createWorkCheck.input';

@InputType()
export class UpdateWorkCheckInput extends PartialType(CreateWorkCheckInput) {}
