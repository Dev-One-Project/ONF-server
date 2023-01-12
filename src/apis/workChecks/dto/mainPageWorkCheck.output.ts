import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class mainPageWorkCheckOutput {
  @Field(() => Int, { nullable: true })
  working: number;

  @Field(() => Int, { nullable: true })
  tardy: number;

  @Field(() => Int, { nullable: true })
  notWorking: number;

  @Field(() => Int, { nullable: true })
  vacation: number;
}
