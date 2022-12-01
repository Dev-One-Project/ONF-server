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
export class Member {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  memberId: string;

  @Column()
  @Field(() => String)
  lastName: string;

  @Column()
  @Field(() => String)
  firstName: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isAdmin: boolean;

  @Column()
  @Field(() => String)
  joinDate: string;

  @Column()
  @Field(() => String, { nullable: true })
  exitDate: string;

  @Column()
  @Field(() => String)
  invitationCode: string;

  @Column()
  @Field(() => String, { nullable: true })
  memo: string;

  @Column()
  @Field(() => Int, { nullable: true })
  leave: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Many to One 근로정보

  // Many to One 직무

  // Many to One 조직

  // Many to One 회사
}