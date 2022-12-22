import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateScheduleInput {
  @Field(() => String, { nullable: true })
  scheduleCategoryId: string;

  @Field(() => String, { nullable: true })
  organizationId: string;

  @Field(() => String, { nullable: true })
  roleCategoryId: string;

  @Field(() => String, { nullable: true })
  startWorkTime: string;

  @Field(() => String, { nullable: true })
  EndWorkTime: string;

  @Field(() => String, { nullable: true })
  memo: string;
}
