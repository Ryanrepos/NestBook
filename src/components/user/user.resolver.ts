import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../libs/dto/user/user';
import { UserSignupInput } from 'src/libs/dto/user/user.input';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Mutation(() => User)  
    public async signUp(@Args('input') input: UserSignupInput): Promise<User> {
        console.log("userResolver => signUp", input)
        return await this.userService.signUp(input);
}
}