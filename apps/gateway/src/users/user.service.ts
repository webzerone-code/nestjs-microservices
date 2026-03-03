import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async upsertAuthUser(input: {
    userId: string;
    email: string;
    name: string;
    password: string;
  }) {
    const now = new Date();
    return this.userModel.findOneAndUpdate(
      { userId: input.userId },
      {
        $set: {
          email: input.email,
          name: input.name,
          password: input.password,
          updatedAt: now,
        },
        $setOnInsert: { role: 'user' },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }
  async findByUserId(userId: string) {
    return this.userModel.findOne({ userId });
  }
  async findByUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
