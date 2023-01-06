import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { ScheduleCategory } from 'src/apis/scheduleCategories/entities/scheduleCategory.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ScheduleTemplate {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  startTime: string;

  @Column()
  @Field(() => String)
  endTime: string;

  @Column()
  @Field(() => String)
  colorCode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  @ManyToOne(() => ScheduleCategory, { nullable: true })
  @Field(() => ScheduleCategory, { nullable: true })
  scheduleCategory: ScheduleCategory;

  @JoinTable()
  @ManyToMany(
    () => Organization,
    (organization) => organization.scheduleTemplate,
  )
  @Field(() => [Organization])
  organization: Organization[];

  @JoinTable()
  @ManyToMany(
    () => RoleCategory,
    (roleCategory) => roleCategory.scheduleTemplate,
  )
  @Field(() => [RoleCategory])
  roleCategory: RoleCategory[];
}
