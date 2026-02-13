import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../libs/dto/user/user';
import { UserLoginInput, UserSignupInput } from 'src/libs/dto/user/user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guards';
import { AuthUser } from '../auth/decorators/authUser.decorator';

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

     @Query(() => User)
     @UseGuards(AuthGuard)
     async getMe(@AuthUser() user: User): Promise<User> {
        return user;
     }

     @Query(() => User)
     public async getUser(@Args("userId") userId: string): Promise<User> {
        return await this.userService.getUser(userId);
     }

     
  }
