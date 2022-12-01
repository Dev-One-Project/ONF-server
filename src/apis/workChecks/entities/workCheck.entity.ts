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
export class WorkCheck {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  workDay: string;

  @Column()
  workingTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quittingTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  breakStartTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  breakFinishTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  totalWorkTime: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  totalBreakTime: string;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Member)
  @Field(() => Member)
  member: Member;

  // Many to One 회사

  // Many to One 조직

  // Many to One 근무일정
}
