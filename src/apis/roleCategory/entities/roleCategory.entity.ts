import { Field, ObjectType } from '@nestjs/graphql';
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
export class RoleCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @Field(() => String, { nullable: false })
  duty: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field(() => String, { nullable: true })
  memo: string;

  @Column()
  @Field(() => String, { nullable: false })
  colorCode: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;
}
