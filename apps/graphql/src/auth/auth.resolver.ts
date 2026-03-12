import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CreateUserInputDto } from '../user/dto/create-user.input.dto';

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async signUp(@Args('input') input: CreateUserInputDto) {}
}
