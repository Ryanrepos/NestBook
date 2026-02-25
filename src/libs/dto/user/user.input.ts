import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { UserRole, UserAuthType, UserStatus } from '../../enums/user.enum';
import { Direction } from 'src/libs/enums/common.enum';

@InputType()
export class UserSignupInput {
  // Email
  @IsNotEmpty()
  @IsEmail()  // ⭐ Email formatini tekshirish
  @Field(() => String)
  userEmail: string;

  // Password
  @IsNotEmpty()
  @Length(8, 50)  // ⭐ Kamida 8 ta belgi (xavfsizlik)
  @Field(() => String)
  userPassword: string;

  // Role (optional)
  @IsOptional()
  @Field(() => UserRole, { nullable: true })
  userRole?: UserRole;

  // Auth Type (optional)
  @IsOptional()
  @Field(() => UserAuthType, { nullable: true })
  userAuthType?: UserAuthType;
}

@InputType()
export class UserLoginInput {
  // Email
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  userEmail: string;

  // Password
  @IsNotEmpty()
  @Length(8, 50)
  @Field(() => String)
  userPassword: string;
}


@InputType()
export class UsersSearch {
  @IsOptional()
  @IsEnum(UserRole)
  @Field(() => UserRole, { nullable: true })
  userRole?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  @Field(() => UserStatus, { nullable: true })
  userStatus?: UserStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class UsersInput {
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @IsOptional()
  @Field(() => String, { nullable: true, defaultValue: 'createdAt' })
  sort?: string;

  @IsOptional()
  @IsEnum(Direction)
  @Field(() => Direction, { nullable: true, defaultValue: Direction.DESC })
  direction?: Direction;

  @Field(() => UsersSearch)
  search: UsersSearch;
}