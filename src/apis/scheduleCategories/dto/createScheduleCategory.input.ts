import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleCategoryInput {
  @Field(() => String)
  scheduleCategoryName: string;

  @Field(() => String)
  colorCode: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isOvertime: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isNotHolidayWork: boolean;

  // 가드 추가되면 뺄꺼임
  // @Field(() => String)
  // companyId: string;
}
