import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateGlobalConfigInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  allowedCheckInBefore: number;

  @Field(() => Int, { nullable: true, defaultValue: 12 })
  allowedCheckInAfter: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isWorkLogEnabled: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isVacationEnabled: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isScheduleEnabled: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isCheckInEnabled: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isCheckOutEnabled: boolean;
}
