import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CreateUserInputDto } from '../user/dto/create-user.input.dto';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth-payload';
import { LoginInputDto } from '../user/dto/login.input.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'signUp' })
  async signUp(@Args('input') input: CreateUserInputDto): Promise<User> {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthPayload, { name: 'login' })
  async login(@Args('input') input: LoginInputDto): Promise<AuthPayload> {
    return this.authService.login(input);
  }
}
