import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, Users } from 'src/libs/dto/user/user';
import { UserLoginInput, UserSignupInput, UsersInput } from 'src/libs/dto/user/user.input';
import { AuthService } from '../auth/auth.service';
import { Direction, Message } from 'src/libs/enums/common.enum';
import { UserStatus } from 'src/libs/enums/user.enum';
import { UserUpdate } from 'src/libs/dto/user/user.update';
import { T } from 'src/libs/types/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signUp(input: UserSignupInput): Promise<User> {
    this.logger.log(`Signup attempt: ${input.userEmail}`);

    const existingEmail = await this.userModel.findOne({
      userEmail: input.userEmail,
    });

    if (existingEmail) {
      this.logger.warn(`Email already exists: ${input.userEmail}`);
      throw new BadRequestException(Message.USED_EMAIL_OR_USERNAME);
    }

    const hashedPassword = await this.authService.hashPassword(
      input.userPassword,
    );

    try {
      const createdUser = await this.userModel.create({
        ...input,
        userPassword: hashedPassword,
        userStatus: UserStatus.ACTIVE,
        // userImage: '/icons/default-user.svg',
      });

      this.logger.log(`User created successfully: ${createdUser._id}`);

      const token = await this.authService.createToken(createdUser);

      return {
        ...createdUser.toObject(),
        accessToken: token,
      } as User;

    } catch (err) {
      this.logger.error(`Signup error: ${err.message}`);

      if (err.code === 11000) {
        throw new BadRequestException(Message.USED_EMAIL_OR_USERNAME);
      }

      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
  }

 public async signIn(input: UserLoginInput): Promise<User> {
    // Find user by email (include password)
    const user = await this.userModel
        .findOne({ userEmail: input.userEmail })
        .select('+userPassword')
        .exec();

    // Check if user exists
    if (!user || user.userStatus === UserStatus.DELETED) {
        throw new BadRequestException(Message.NO_USER_FOUND);
    }

    // Check if user is blocked
    if (user.userStatus === UserStatus.BLOCK) {
        throw new BadRequestException(Message.BLOCKED_USER);
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePassword(
    input.userPassword,
    user.userPassword as string);

    if (!isPasswordValid) {
        throw new BadRequestException(Message.WRONG_PASSWORD);
    }

    // Generate JWT token
    const token = await this.authService.createToken(user);

    // Return user with token
    return {
        ...user.toObject(),
        accessToken: token,
    } as User;
 }

 public async getUser(userId: string): Promise<User> {
    this.logger.log(`Get user by ID: ${userId}`);

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException(Message.NO_USER_FOUND);
    }

    if(user.userStatus === UserStatus.DELETED) {
      this.logger.warn(`User is deleted: ${userId}`);
      throw new NotFoundException(Message.NO_USER_FOUND);
    }

    this.logger.log(`User found: ${user.userEmail}`);

    return user;
 }

 public async updateUser(input: UserUpdate, userId: ObjectId): Promise<User> {
    this.logger.log(`Update user: ${userId}`);

    const updateUser = await this.userModel.findByIdAndUpdate(
      {
        _id: userId,
        UserStatus: UserStatus.ACTIVE,
      }, 
      {
        input,
      },
      {
        new: true,
      }
    )
    .exec();

    if (!updateUser) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    updateUser.accessToken = await this.authService.createToken(updateUser);

    return updateUser;
 }

  public async getUsers(input: UsersInput): Promise<Users> {
    const { userStatus, userRole, text } = input.search;

    // Build match object
    const match: T = {};

    if (userStatus) match.userStatus = userStatus;
    if (userRole) match.userRole = userRole;

    // Search in both email and fullName
    if (text) {
      match.$or = [
        { userEmail: { $regex: new RegExp(text, 'i') } },
        { userFullName: { $regex: new RegExp(text, 'i') } }
      ];
    }

    // Build sort object
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC
    };

    console.log('match:', match);
    console.log('sort:', sort);

    const result = await this.userModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit }
            ],
            metaCounter: [{ $count: 'total' }]
          }
        }
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const { list, metaCounter } = result[0];
    const total = metaCounter.length > 0 ? metaCounter[0].total : 0;

    this.logger.log(`Found ${list.length} users, total: ${total}`);

    return {
      list,
      total,
    };
  }

  public async deleteUser(userId: string, adminId: ObjectId): Promise<boolean> {

    const user = await this.userModel.findById(userId).exec();

    if(!user) throw new NotFoundException(Message.NO_USER_FOUND);

    if (user.userStatus === UserStatus.DELETED) throw new BadRequestException(Message.ALREADY_DELETED_USER);
    
    if (user._id.toString() === adminId.toString()) {
      throw new BadRequestException("Can't delete yourself");
    }

    try {
      await this.userModel.findByIdAndUpdate(userId, {
        userStatus: UserStatus.DELETED,
        deletedAt: new Date(),
      }).exec();
      return true;
    } catch (err) {
      throw new InternalServerErrorException(Message.REMOVE_FAILED);
    }

  }
}
