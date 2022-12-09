import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/categories/entities/category.entity';
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
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  startWorkTime: string;

  @Column()
  @Field(() => String)
  finishWorkTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member)
  @Field(() => Member)
  member: Member;

  // Many to One 근무 일정 유형

  @ManyToOne(() => Organization)
  @Field(() => Organization)
  organization: Organization;

  @ManyToOne(() => Category)
  @Field(() => Category)
  category: Category;
}
