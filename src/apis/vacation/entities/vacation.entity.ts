import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { VacationCategory } from 'src/apis/vacationCategory/entities/vacationCategory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Vacation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ type: 'datetime' })
  @Field(() => Date)
  vacationStartDate: Date;

  @Column({ type: 'datetime', nullable: true })
  @Field(() => Date, { nullable: true })
  vacationEndDate: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member, { nullable: true })
  @Field(() => Member, { nullable: true })
  member: Member;

  @ManyToOne(() => Company, { nullable: true })
  @Field(() => Company, { nullable: true })
  company: Company;

  @ManyToOne(() => VacationCategory, { nullable: true })
  @Field(() => VacationCategory, { nullable: true })
  vacationCategory: VacationCategory;
}
