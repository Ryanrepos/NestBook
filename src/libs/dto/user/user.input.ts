import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserRole, UserAuthType } from '../../enums/user.enum';

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