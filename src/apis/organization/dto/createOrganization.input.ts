import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => String, { nullable: true })
  lat: string;

  @Field(() => String, { nullable: true })
  lng: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: false })
  color: string;
}
