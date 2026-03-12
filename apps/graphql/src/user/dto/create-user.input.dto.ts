import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserInputDto {
  @IsString()
  @Field()
  username: string;

  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field(() => String)
  first_name: string;

  @IsString()
  @Field(() => String)
  last_name: string;

  @IsString()
  @Field(() => String)
  password: string;
}
