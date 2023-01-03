import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GlobalConfig } from 'src/apis/globalConfig/entities/globalConfig.entity';
import { Account } from 'src/apis/accounts/entites/account.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @OneToOne(() => GlobalConfig)
  @JoinColumn()
  @Field(() => GlobalConfig, { nullable: true })
  globalConfig: GlobalConfig;

  @OneToMany(() => RoleCategory, (roleCategory) => roleCategory.company)
  roleCategorys: RoleCategory[];

  @ManyToOne(() => Account, (account) => account.company)
  @JoinColumn()
  account: Account;
}
