import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkCheckInput {
  @Field(() => Date, { nullable: false })
  workDay: Date;

  @Field(() => Date, { nullable: true })
  workingTime: Date;

  @Field(() => Date, { nullable: true })
  quittingTime: Date;

  // @Field(() => Date, { nullable: true })
  // breakStartTime: Date;

  // @Field(() => Date, { nullable: true })
  // breakEndTime: Date;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isWorking: boolean;

  @Field(() => String, { nullable: true })
  workCheckMemo: Date;

  @Field(() => String, { nullable: false })
  memberId: string;

  @Field(() => String, { nullable: true })
  scheduleId: string;

  @Field(() => String, { nullable: true })
  organizationId: string;

  @Field(() => String, { nullable: true })
  roleCategoryId: string;
}
