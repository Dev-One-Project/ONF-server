import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Vacation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Date)
  vacationEnd: Date;

  @Column()
  @Field(() => Date)
  vacationStart: Date;

  @Column()
  @Field(() => String)
  vacationGroup: string;

  @Column()
  @Field(() => String)
  vacationType: string;

  @Column()
  @Field(() => Int)
  paidTime: number;

  @Column()
  @Field(() => Number)
  deductionDays: number;

  @Column()
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
