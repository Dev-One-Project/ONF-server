import { Field, InputType } from '@nestjs/graphql';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { ScheduleCategory } from 'src/apis/scheduleCategories/entities/scheduleCategory.entity';

@InputType()
export class CreateScheduleTemplateInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => String)
  colorCode: string;

  @Field(() => String, { nullable: true })
  memo: string;

  @Field(() => String, { nullable: true })
  scheduleCategoryId: ScheduleCategory;

  @Field(() => String)
  organizationId: Organization;

  @Field(() => String)
  roleCategoryId: RoleCategory;
}
