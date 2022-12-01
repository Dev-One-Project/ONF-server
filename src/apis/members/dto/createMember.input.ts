import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateMemberInput {
  @Field(() => String)
  lastName: string;

  @Field(() => String)
  firstName: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isAdmin: boolean;

  @Field(() => String)
  joinDate: string;

  @Field(() => String, { nullable: true })
  exitDate: string;

  @Field(() => String)
  invitationCode: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => Int, { nullable: true })
  leave: number;
}
