import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMemberInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isAdmin: boolean;

  @Field(() => String)
  joinDate: string;

  @Field(() => String, { nullable: true })
  exitDate: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => String, { nullable: true })
  organizationId: string;

  @Field(() => String, { nullable: true })
  roleCategoryId: string;
}
