import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ValidationCode {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  validationCode: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { defaultValue: false })
  isValid: boolean;
}
