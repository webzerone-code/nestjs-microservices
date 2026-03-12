import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';

@ObjectType()
export class AuthPayload {
  @Field(() => Int)
  userId: number;

  @Field(() => Role)
  Role: Role;

  @Field()
  accessToken: string;
}
