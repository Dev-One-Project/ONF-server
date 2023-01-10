import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from 'src/apis/members/entities/member.entity';
import { WorkCheck } from '../entities/workCheck.entity';

@ObjectType()
export class WorkCheckOutput {
  @Field(() => Member)
  member: Member;

  @Field(() => [WorkCheck])
  data: WorkCheck[];
}
