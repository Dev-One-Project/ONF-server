import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateHolidayInput {
  @Field(() => String, { nullable: true })
  dateName: string;

  @Field(() => String, { nullable: true })
  locdate: string;
}
