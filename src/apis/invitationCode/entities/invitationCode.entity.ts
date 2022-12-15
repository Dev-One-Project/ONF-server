import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Member } from 'src/apis/members/entities/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class InvitationCode {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  invitationCode: string;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  @JoinColumn()
  @OneToOne(() => Member)
  @Field(() => Member)
  member: Member;
}
