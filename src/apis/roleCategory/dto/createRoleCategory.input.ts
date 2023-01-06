import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleCategoryInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  memo: string;

  @Field(() => String, { nullable: false })
  colorCode: string;
}
