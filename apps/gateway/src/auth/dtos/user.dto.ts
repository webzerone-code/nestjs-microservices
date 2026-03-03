import { Optional } from '@nestjs/common';

export class UserDto {
  userId: string;
  email: string;
  name: string;
  @Optional()
  accessToken: string | null;
}
