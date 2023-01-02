import { Field, InputType, Int } from '@nestjs/graphql';
import { MEMBERSHIP_TYPE } from '../entities/company.entity';

@InputType()
export class CreateCompanyInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  logoUrl: string;

  @Field(() => String, { nullable: true })
  rules: string;

  @Field(() => MEMBERSHIP_TYPE, { nullable: true })
  membership: MEMBERSHIP_TYPE;

  @Field(() => Int, { nullable: true })
  memberCount: number;
}
