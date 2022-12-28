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

  @Column({ type: 'enum', enum: Role })
  @Field(() => String, { nullable: true })
  roles: Role[];

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

  @OneToOne(() => Company, { nullable: true })
  @JoinColumn()
  @Field(() => Company, { nullable: true })
  company: Company;
}
