import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMemberInput {
  @Field(() => String)
  name: string;

  @Field(() => Date, { nullable: true })
  joinDate: Date;

  @Field(() => Date, { nullable: true })
  exitDate: Date;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => String)
  organizationId: string;

  @Field(() => String)
  roleCategoryId: string;
}
