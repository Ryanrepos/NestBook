import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { BookStatus } from '../../enums/book.enum';
import { User } from '../user/user';

@ObjectType()
export class Book {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => BookStatus)
  bookStatus: BookStatus;

  @Field(() => String)
  bookTitle: string;

  @Field(() => Float)
  bookPrice: number;

  @Field(() => Int)
  bookViews: number;

  @Field(() => Int)
  bookLikes: number;

  @Field(() => Int)
  bookComments: number;

  @Field(() => Int)
  bookRank: number;

  @Field(() => [String])
  bookImages: string[];

  @Field(() => String, { nullable: true })
  bookDesc?: string;

  @Field(() => Boolean)
  bookRent: boolean;

  // Author ID
  @Field(() => String)
  memberId: ObjectId;

  // Populated author (optional, for queries with author info)
  @Field(() => User, { nullable: true })
  memberData?: User;

  // Soft delete
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  // Timestamps
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Aggregation fields (calculated per request)
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;

  @Field(() => Boolean, { nullable: true })
  meBookmarked?: boolean;
}

@ObjectType()
export class Books {
  @Field(() => [Book])
  list: Book[];

  @Field(() => Int)
  total: number;
}