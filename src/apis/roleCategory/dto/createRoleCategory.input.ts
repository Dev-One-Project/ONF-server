import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleCategoryInput {
  @Field(() => String, { nullable: false })
  duty: string;

  @Field(() => String, { nullable: false })
  memo: string;

  @Field(() => String, { nullable: false })
  colorCode: string;
}
