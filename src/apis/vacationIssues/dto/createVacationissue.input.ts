import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateVacationIssueInput {
  @Field(() => String)
  memberId: string;

  @Field(() => Int)
  vacationAll: number;

  @Field(() => Date)
  startingPoint: Date;

  @Field(() => Date)
  expirationDate: Date;

  @Field(() => String)
  description: string;
}
