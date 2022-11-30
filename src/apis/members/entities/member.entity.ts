import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Member {}
