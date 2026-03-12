import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInputDto } from '../user/dto/create-user.input.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';
import { AuthPayload } from './auth-payload';
import { LoginInputDto } from '../user/dto/login.input.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'relationOne')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(input: CreateUserInputDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (checkUser)
      throw new InternalServerErrorException('User already exists');

    const hashPassword = await bcrypt.hash(input.password, 10);
    if (!hashPassword) throw new InternalServerErrorException('Failed to hash');
    const user = this.userRepository.create({
      ...input,
      password: hashPassword,
      role: Role.USER,
    });
    return await this.userRepository.save(user);
  }

  async login(input: LoginInputDto): Promise<AuthPayload> {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      role: user.role,
    });
    return { userId: user.id, Role: user.role, accessToken };
  }
}
