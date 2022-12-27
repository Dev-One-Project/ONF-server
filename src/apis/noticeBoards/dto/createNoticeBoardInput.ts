import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoticeBoardInput {
  @Field(() => String)
  preface: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
