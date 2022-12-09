import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkCheckInput {
  @Field(() => Date, { nullable: true })
  workingTime: Date;

  @Field(() => Date, { nullable: true })
  quittingTime: Date;

  @Field(() => Date, { nullable: true })
  breakStartTime: Date;

  @Field(() => Date, { nullable: true })
  breakFinishTime: Date;
}
