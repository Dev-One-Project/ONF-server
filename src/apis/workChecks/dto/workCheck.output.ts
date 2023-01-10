import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { Schedule } from 'src/apis/schedules/entities/schedule.entity';

@ObjectType()
export class WorkCheckOutput {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  workDay: Date;

  @Field(() => Date, { nullable: true })
  workingTime: Date;

  @Field(() => Date, { nullable: true })
  quittingTime: Date;

  @Field(() => String, { nullable: true })
  workCheckMemo: string;

  @Field(() => Boolean, { defaultValue: false })
  isComfirmed: boolean;

  @Field(() => String, { nullable: true })
  workingTimeRange: string;

  @Field(() => String, { nullable: true })
  endTimeRange: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => Member)
  member: Member;

  @Field(() => Company)
  company: Company;

  @Field(() => Organization, { nullable: true })
  organization: Organization;

  @Field(() => Schedule, { nullable: true })
  schedule: Schedule;

  @Field(() => RoleCategory, { nullable: true })
  roleCategory: RoleCategory;
}
