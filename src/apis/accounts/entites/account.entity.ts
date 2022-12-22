import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Role } from 'src/common/types/enum.role';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  role: Role;

  @Column()
  password: string;

  @OneToOne(() => Member, { nullable: true })
  @JoinColumn()
  @Field(() => Member, { nullable: true })
  member: Member;

  @OneToOne(() => Company, { nullable: true })
  @JoinColumn()
  @Field(() => Company, { nullable: true })
  company: Company;
}
