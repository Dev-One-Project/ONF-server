import { Field, ObjectType } from '@nestjs/graphql';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { ScheduleCategory } from 'src/apis/scheduleCategories/entities/scheduleCategory.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => ScheduleCategory, { nullable: true })
  @Field(() => ScheduleCategory, { nullable: true })
  scheduleCategory: ScheduleCategory;

  @ManyToOne(() => Organization)
  @Field(() => Organization)
  organization: Organization;

  @ManyToOne(() => RoleCategory)
  @Field(() => RoleCategory)
  roleCategory: RoleCategory;
}
