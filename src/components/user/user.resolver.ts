import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, Users } from '../../libs/dto/user/user';
import { UserLoginInput, UserSignupInput, UsersInput } from 'src/libs/dto/user/user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guards';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { UserUpdate } from 'src/libs/dto/user/user.update';
import type { ObjectId } from 'mongoose';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Mutation(() => User)  
    public async signUp(@Args('input') input: UserSignupInput): Promise<User> {
        console.log("userResolver => signUp", input)
        return await this.userService.signUp(input);
    }

    @Mutation(() => User)
    public async signIn(@Args('input') input: UserLoginInput): Promise<User> {
        console.log("userResolver => signIn", input)
        return await this.userService.signIn(input);
    }
     @UseGuards(AuthGuard)
     @Query(() => User)
     async getMe(@AuthUser() user: User): Promise<User> {
        return user;
     }

     @Query(() => User)
     public async getUser(@Args("userId") userId: string): Promise<User> {
        return await this.userService.getUser(userId);
     }

     @UseGuards(AuthGuard)
     @Mutation(() => User)
     public async updateUser(@Args("input") input: UserUpdate, @AuthUser('_id') userId: ObjectId): Promise<User> {
        return await this.userService.updateUser(input, userId);
     }
     
     @Query(() => Users)
     public async getUsers(@Args('input') input: UsersInput): Promise<Users> {
         return await this.userService.getUsers(input);
     }
  }
