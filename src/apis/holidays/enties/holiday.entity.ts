import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Holiday {
  @Field(() => String)
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  dateName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  locdate: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'float', nullable: true })
  premuimRate: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  year: string;
}
