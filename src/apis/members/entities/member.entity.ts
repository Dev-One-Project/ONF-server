import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/apis/accounts/entites/account.entity';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Organization } from 'src/apis/organization/entities/organization.entity';
import { RoleCategory } from 'src/apis/roleCategory/entities/roleCategory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @Column()
  @Field(() => String)
  phone: string;

  // @Column({ default: false })
  // @Field(() => Boolean, { nullable: true, defaultValue: false })
  // isAdmin: boolean;

  @Column()
  @Field(() => String)
  joinDate: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  exitDate: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isJoin: boolean;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  leave: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  // One to One 근로정보

  @ManyToOne(() => RoleCategory, { nullable: true })
  @Field(() => RoleCategory, { nullable: true })
  roleCategory: RoleCategory;

  @ManyToOne(() => Organization, { nullable: true })
  @Field(() => Organization, { nullable: true })
  organization: Organization;
  @OneToOne(() => Account, (account) => account.member)
  account: Account;
}
