import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInputDto } from './dto/create-user.input.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => Int, nullable: false }) id: number,
  ): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInputDto,
  ) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.delete(id);
  }

  @ResolveField('profile')
  async profile(@Parent() user: User) {
    return await user.profile;
  }

  @ResolveField('fullName', () => String)
  async fullName(@Parent() user: User): Promise<string> {
    return await `${user.first_name} ${user.last_name}`;
  }
}
