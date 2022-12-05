import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => String)
  color: string;

  @Field(() => String)
  companyId: string;
}
