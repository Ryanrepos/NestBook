import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../libs/dto/user/user';
import { UserStatus } from '../../libs/enums/user.enum';
import { shapeIntoMongoObjectId } from 'src/libs/config';
import { T } from 'src/libs/types/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>, // USER is DTO
    private jwtService: JwtService,
  ) {}

  // Password hash qilish
  public async hashPassword(userPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(userPassword, salt);
  }

  // Password tekshirish
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // JWT token yaratish
  public async createToken(user: User): Promise<string> {
    console.log('user:', user);
    const payload: T = { userNick: 'TEST' };

    // User ma'lumotlarini payload'ga ko'chirish
    Object.keys(user['_doc'] ? user['_doc'] : user).map((ele) => {
      payload[`${ele}`] = user[`${ele}`];
    });
    
    // Password'ni o'chirish (xavfsizlik)
    delete payload.userPassword;
    console.log('payload:', payload);

    return await this.jwtService.signAsync(payload);
  }

  // JWT token tekshirish
  public async verifyToken(token: string): Promise<User> {
    try {
      const user = await this.jwtService.verifyAsync(token);
      user._id = shapeIntoMongoObjectId(user._id);
      
      // User database'da bormi va faolmi tekshirish
      const dbUser = await this.userModel.findById(user._id).exec();
      
      if (!dbUser || dbUser.userStatus !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid user');
      }
      
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}