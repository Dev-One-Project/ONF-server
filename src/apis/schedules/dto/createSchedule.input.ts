import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field(() => String)
  scheduleTemplateId: string;

  @Field(() => [String])
  organizationId: string[];

  @Field(() => [String])
  memberId: string[];
}
