import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/libs/dto/user/user';
import { UserSignupInput } from 'src/libs/dto/user/user.input';
import { AuthService } from '../auth/auth.service';
import { Message } from 'src/libs/enums/common.enum';
import { UserStatus } from 'src/libs/enums/user.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signUp(input: UserSignupInput): Promise<User> {
    this.logger.log(`Signup attempt: ${input.userEmail}`);

    // 1. Check if email already exists
    const existingEmail = await this.userModel.findOne({
      userEmail: input.userEmail,
    });

    if (existingEmail) {
      this.logger.warn(`Email already exists: ${input.userEmail}`);
      throw new BadRequestException(Message.USED_EMAIL_OR_USERNAME);
    }

    // 2. Check if username already exists
    const existingNick = await this.userModel.findOne({
      userNick: input.userNick,
    });

    if (existingNick) {
      this.logger.warn(`Username already exists: ${input.userNick}`);
      throw new BadRequestException(Message.USED_EMAIL_OR_USERNAME);
    }

    // 3. Hash password
    const hashedPassword = await this.authService.hashPassword(
      input.userPassword,
    );

    try {
      // 4. Create user with defaults
      const createdUser = await this.userModel.create({
        ...input,
        userPassword: hashedPassword,
        userStatus: UserStatus.ACTIVE,
      });

      this.logger.log(`User created successfully: ${createdUser._id}`);

      // 5. Generate JWT token
      const token = await this.authService.createToken(createdUser);

      // 6. Return user with token (password excluded by DTO)
      return {
        ...createdUser.toObject(),
        accessToken: token,
      } as User;

    } catch (err) {
      this.logger.error(`Signup error: ${err.message}`);

      // Handle MongoDB duplicate key error (backup check)
      if (err.code === 11000) {
        throw new BadRequestException(Message.USED_EMAIL_OR_USERNAME);
      }

      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
  }
}
