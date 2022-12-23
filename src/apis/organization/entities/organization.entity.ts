import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { ScheduleTemplate } from 'src/apis/scheduleTemplates/entities/scheduleTemplate.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  lat: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  lng: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: true })
  color: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Company)
  @Field(() => Company, { nullable: true })
  company: Company;

  @ManyToMany(
    () => ScheduleTemplate,
    (scheduleTemplate) => scheduleTemplate.organization,
  )
  @Field(() => [ScheduleTemplate])
  scheduleTemplate: ScheduleTemplate[];
}
