import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMemberInput } from './createMember.input';

@InputType()
export class UpdateMemberInput extends PartialType(CreateMemberInput) {}
