import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { Schedule } from 'src/apis/schedules/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class WorkCheck {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Date)
  workDay: Date;

  // @Column({ type: 'datetime', nullable: false })
  // @Field(() => Date, { nullable: true })
  // workingTime: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  workingTime: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  quittingTime: Date;

  // @Column({ nullable: true })
  // @Field(() => Date, { nullable: true })
  // breakStartTime: Date;

  // @Column({ nullable: true })
  // @Field(() => Date, { nullable: true })
  // breakEndTime: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  workCheckMemo: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Member)
  @Field(() => Member)
  member: Member;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  @ManyToOne(() => Organization)
  @Field(() => Organization)
  organization: Organization;

  @ManyToOne(() => Schedule)
  @Field(() => Schedule)
  schedule: Schedule;

  @ManyToOne(() => RoleCategory)
  @Field(() => RoleCategory)
  roleCategory: RoleCategory;
}
