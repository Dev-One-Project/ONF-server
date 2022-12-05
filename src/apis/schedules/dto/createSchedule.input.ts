import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field(() => String)
  startWorkTime: string;

  @Field(() => String)
  finishWorkTime: string;
}
