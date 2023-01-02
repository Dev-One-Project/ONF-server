import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMemberInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Date)
  joinDate: Date;

  @Field(() => Date, { nullable: true })
  exitDate: Date;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => String, { nullable: true })
  organizationId: string;

  @Field(() => String, { nullable: true })
  roleCategoryId: string;
}
