import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  color: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isOvertime: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isNotHolidayWork: boolean;
}
