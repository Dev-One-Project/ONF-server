import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from 'src/apis/members/entities/member.entity';
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

  // Many to One 조직

  // Many to One 직무
}
