import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ScheduleCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  color: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isOvertime: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isNotHolidayWork: boolean;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;
}
