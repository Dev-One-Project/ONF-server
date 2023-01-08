import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
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
export class VacationIssue {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Date)
  startingPoint: Date;

  @Column()
  @Field(() => Date)
  expirationDate: Date;

  @Column()
  @Field(() => Int)
  vacationAll: number;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  useVacation: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  remaining: number;

  @Column()
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member)
  @Field(() => Member)
  member: Member;

  @ManyToOne(() => Company, { nullable: true })
  @Field(() => Company, { nullable: true })
  company: Company;

  @ManyToOne(() => Organization)
  @Field(() => Organization)
  organization: Organization;
}
