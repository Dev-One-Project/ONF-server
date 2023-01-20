import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkCheckInput {
  @Field(() => Date, { nullable: false })
  workDay: Date;

  @Field(() => String, { nullable: false })
  workingTime: string;

  @Field(() => String, { nullable: true })
  quittingTime: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isWorking: boolean;

  @Field(() => String, { nullable: true })
  workCheckMemo: Date;

  @Field(() => String, { nullable: false })
  memberId: string;

  // TODO: 무일정 근무 추가할 시 nullable:true
  @Field(() => String, { nullable: false })
  scheduleId: string;

  // @Field(() => String, { nullable: true })
  // organizationId: string;

  // @Field(() => String, { nullable: true })
  // roleCategoryId: string;
}
