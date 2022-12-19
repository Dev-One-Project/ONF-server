import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class GlobalConfig {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  allowedCheckInBefore: number;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int, { nullable: true, defaultValue: 12 })
  allowedCheckInAfter: number;

  @Column({ type: 'tinyint', nullable: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isWorkLogEnabled: boolean;

  @Column({ type: 'tinyint', nullable: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isVacationEnabled: boolean;

  @Column({ type: 'tinyint', nullable: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isScheduleEnabled: boolean;

  @Column({ type: 'tinyint', nullable: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isCheckInEnabled: boolean;

  @Column({ type: 'tinyint', nullable: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isCheckOutEnabled: boolean;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @JoinColumn()
  @OneToOne(() => Company)
  @Field(() => Company, { nullable: true })
  company: Company;
}
