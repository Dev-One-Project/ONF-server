import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
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
export class VacationCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  timeOption: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column()
  @Field(() => Int)
  paidTime: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field(() => Number)
  deductionDays: number;

  @ManyToOne(() => Organization)
  @Field(() => Organization)
  organization: Organization;

  @ManyToOne(() => RoleCategory)
  @Field(() => RoleCategory)
  roleCategory: RoleCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
