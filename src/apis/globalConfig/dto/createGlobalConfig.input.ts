import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateGlobalConfigInput {
  @Field(() => Int, { nullable: false, defaultValue: 10 })
  allowedCheckInBefore: number;

  @Field(() => Int, { nullable: false, defaultValue: 12 })
  allowedCheckInAfter: number;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isWorkLogEnabled: boolean;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isVacationEnabled: boolean;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isScheduleEnabled: boolean;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isCheckInEnabled: boolean;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  isCheckOutEnabled: boolean;
}
