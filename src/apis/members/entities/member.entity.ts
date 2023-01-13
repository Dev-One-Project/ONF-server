import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/apis/accounts/entites/account.entity';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import { WorkInfo } from 'src/apis/workInfo/entites/workInfo.entity';
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

@Entity()
@ObjectType()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  joinDate: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  exitDate: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isJoin: boolean;

  @Column({ type: 'float', nullable: true })
  @Field(() => Float, { nullable: true })
  leave: number;

  @Column()
  @Field(() => String)
  appliedFrom: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  @ManyToOne(() => WorkInfo, (workInfo) => workInfo.members)
  @Field(() => WorkInfo, { nullable: true })
  workInfo: WorkInfo;

  @ManyToOne(() => Organization)
  @Field(() => Organization, { nullable: true })
  organization: Organization;

  @ManyToOne(() => RoleCategory)
  @Field(() => RoleCategory, { nullable: true })
  roleCategory: RoleCategory;

  @OneToOne(() => Account, (account) => account.member)
  account: Account;
}
