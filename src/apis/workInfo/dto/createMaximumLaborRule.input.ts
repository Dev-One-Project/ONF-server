import { Field, InputType } from '@nestjs/graphql';
import { PeriodRange, Standard } from 'src/common/types/enum.range';

@InputType()
export class CreateMaximumLaberInput {
  @Field(() => Standard, { nullable: true })
  maximumStandard: Standard;

  @Field(() => String, { nullable: true })
  maximumHours: string;

  @Field(() => String, { nullable: true })
  maximumUnitPeriod: string;

  @Field(() => PeriodRange, { nullable: true })
  maximumPeriodRange: PeriodRange;
}
