import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserRole, UserStatus } from '../../enums/user.enum';

@InputType()
export class UserUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Length(3, 20)
  @Field(() => String, { nullable: true })
  userNick?: string;

  @IsOptional()
  @Length(8, 50)
  @Field(() => String, { nullable: true })
  userPassword?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  userFullName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  userImage?: string;

  @IsOptional()
  @Length(0, 500)
  @Field(() => String, { nullable: true })
  userBio?: string;

  @IsOptional()
  @Field(() => UserRole, { nullable: true })
  userRole?: UserRole;

  @IsOptional()
  @Field(() => UserStatus, { nullable: true })
  userStatus?: UserStatus;
}