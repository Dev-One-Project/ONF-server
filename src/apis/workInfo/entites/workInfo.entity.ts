import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PeriodRange, Standard } from 'src/common/types/enum.range';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(PeriodRange, {
  name: 'PeriodRange',
});
registerEnumType(Standard, {
  name: 'Standard',
});
@ObjectType()
@Entity()
export class WorkInfo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field(() => [String], { nullable: true })
  fixedLabor: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  weekOffDays: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column({
    type: 'enum',
    enum: Standard,
    default: Standard.WEEK,
  })
  @Field(() => String, { nullable: true })
  fixedStandard: Standard;

  @Column({ nullable: true, default: '40' })
  @Field(() => String, { nullable: true })
  fixedHours: string;

  @Column({ nullable: true, default: '1' })
  @Field(() => String, { nullable: true })
  fixedUnitPeriod: string;

  @Column({ type: 'enum', enum: PeriodRange, default: PeriodRange.WEEK })
  @Field(() => String, { nullable: true })
  fixedPeriodRange: PeriodRange;

  @Column({
    type: 'enum',
    enum: Standard,
    default: Standard.WEEK,
  })
  @Field(() => String, { nullable: true })
  maximumStandard: Standard;

  @Column({ nullable: true, default: '52' })
  @Field(() => String, { nullable: true })
  maximumHours: string;

  @Column({ nullable: true, default: '1' })
  @Field(() => String, { nullable: true })
  maximumUnitPeriod: string;

  @Column({ type: 'enum', enum: PeriodRange, default: PeriodRange.WEEK })
  @Field(() => String, { nullable: true })
  maximumPeriodRange: PeriodRange;

  @Column({ nullable: true })
  @Field(() => String)
  companyId: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
