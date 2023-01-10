import { Field, InputType } from '@nestjs/graphql';
import { PeriodRange, Standard } from 'src/common/types/enum.range';

@InputType()
export class CreateFixedLaborDaysInput {
  @Field(() => Standard, { nullable: true })
  fixedStandard: Standard;

  @Field(() => String, { nullable: true })
  fixedHours: string;

  @Field(() => String, { nullable: true })
  fixedUnitPeriod: string;

  @Field(() => PeriodRange, { nullable: true })
  fixedPeriodRange: PeriodRange;
}
