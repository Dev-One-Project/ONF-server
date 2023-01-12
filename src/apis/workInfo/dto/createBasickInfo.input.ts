import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBasicWorkInfoInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  fixedLabor: string;

  @Field(() => String, { nullable: true })
  weekOffDays: string;

  @Field(() => String, { nullable: true })
  memo: string;
}
