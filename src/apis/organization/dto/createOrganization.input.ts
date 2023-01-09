import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: true })
  checkPoint: string;

  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => String, { nullable: true })
  lat: string;

  @Field(() => String, { nullable: true })
  lng: string;

  @Field(() => Int, { nullable: true })
  range: number;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: false })
  color: string;
}
