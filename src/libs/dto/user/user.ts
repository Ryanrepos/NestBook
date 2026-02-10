import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { UserRole, UserStatus, UserAuthType } from '../../enums/user.enum';

@ObjectType()
export class User {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => UserRole)
  userRole: UserRole;

  @Field(() => UserStatus)
  userStatus: UserStatus;

  @Field(() => UserAuthType)
  userAuthType: UserAuthType;

  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  userNick: string;

  // ⚠️ Password hech qachon GraphQL'da qaytmaydi!
  userPassword?: string;

  @Field(() => String, { nullable: true })
  userFullName?: string;

  @Field(() => String)
  userImage: string;

  @Field(() => String, { nullable: true })
  userBio?: string;

  // ========== STATISTICS ==========
  @Field(() => Int)
  userBooks: number;

  @Field(() => Int)
  userReviews: number;

  @Field(() => Int)
  userFollowers: number;

  @Field(() => Int)
  userFollowings: number;

  @Field(() => Int)
  userLikes: number;

  @Field(() => Int)
  userViews: number;

  // ========== TIMESTAMPS ==========
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // ========== AUTH TOKEN ==========
  // ⭐ Faqat login/signup'da qaytadi!
  @Field(() => String, { nullable: true })
  accessToken?: string;

  // ========== AGGREGATION FIELDS ==========
  // ⭐ Faqat specific query'larda qaytadi
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;

  @Field(() => Boolean, { nullable: true })
  meFollowed?: boolean;
}

@ObjectType()
export class Users {
  @Field(() => [User])
  list: User[];

  @Field(() => Int)
  total: number;
}