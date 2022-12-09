import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { Schedule } from 'src/apis/schedules/entities/schedule.entity';

@ObjectType()
export class WorkCheckOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  workDay: string;

  @Field(() => String, { nullable: true })
  workingTime: string | Date;

  @Field(() => String, { nullable: true })
  quittingTime: string;

  @Field(() => Date, { nullable: true })
  breakStartTime: Date;

  @Field(() => Date, { nullable: true })
  breakFinishTime: Date;

  @Field(() => String, { nullable: true })
  totalWorkTime: string;

  @Field(() => String, { nullable: true })
  totalBreakTime: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @Field(() => Member)
  member: Member;

  @Field(() => Company)
  company: Company;

  @Field(() => Organization)
  organization: Organization;

  @Field(() => Schedule)
  schedule: Schedule;
}
