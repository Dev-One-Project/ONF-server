import { Field, ObjectType } from '@nestjs/graphql';
import { Company } from 'src/apis/companies/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Holiday {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  dateName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  locdate: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  year: string;

  @Field()
  @ManyToOne(() => Company, { nullable: true })
  company: Company;
}
