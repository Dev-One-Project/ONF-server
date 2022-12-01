import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkCheckInput {
  @Field(() => String)
  workDay: string;

  @Field(() => String, { nullable: true })
  quittingTime: string;

  @Field(() => String, { nullable: true })
  breakStartTime: string;

  @Field(() => String, { nullable: true })
  breakFinishTime: string;

  @Field(() => String, { nullable: true })
  totalWorkTime: string;

  @Field(() => String, { nullable: true })
  totalBreakTime: string;
}
