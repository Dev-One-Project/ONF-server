import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/apis/accounts/entites/account.entity';
import { Company } from 'src/apis/companies/entities/company.entity';
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
export class NoticeBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  preface: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column({ type: 'mediumtext' })
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Account)
  @Field(() => Account)
  account: Account;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;
}
