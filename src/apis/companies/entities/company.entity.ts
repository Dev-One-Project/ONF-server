import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MEMBERSHIP_TYPE {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

registerEnumType(MEMBERSHIP_TYPE, {
  name: 'MEMBERSHIP_TYPE',
});

@Entity()
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  rules: string;

  @Column({ default: 0, nullable: false })
  @Field(() => Int, { nullable: true })
  memberCount: number;

  @Column({
    type: 'enum',
    enum: MEMBERSHIP_TYPE,
    default: MEMBERSHIP_TYPE.FREE,
  })
  @Field(() => MEMBERSHIP_TYPE, { nullable: true })
  membership: MEMBERSHIP_TYPE;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
