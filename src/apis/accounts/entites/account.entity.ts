import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import { Role } from 'src/common/types/enum.role';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => String, { nullable: true })
  roles: Role;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 30 })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  @Field(() => String, { nullable: true })
  phone: string;

  @OneToOne(() => Member, { nullable: true })
  @JoinColumn()
  @Field(() => Member, { nullable: true })
  member: Member;

  @Column()
  companyId: string;

  @OneToMany(() => Company, (company) => company.account)
  @Field(() => Company, { nullable: true })
  company: Company;
}
