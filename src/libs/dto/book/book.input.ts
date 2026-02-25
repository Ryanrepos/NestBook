import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min, Max, Length, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { BookStatus } from '../../enums/book.enum';
import { Direction } from '../../enums/common.enum';
import { ObjectId } from 'mongoose';

// ========== CREATE BOOK ==========
@InputType()
export class BookInput {
  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  bookTitle: string;

  @IsNotEmpty()
  @Min(0)
  @Field(() => Float)
  bookPrice: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  bookDesc?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  bookImages?: string[];

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  bookRent?: boolean;

}

// ========== UPDATE BOOK ==========
@InputType()
export class BookUpdate {
  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  bookTitle?: string;

  @IsOptional()
  @Min(0)
  @Field(() => Float, { nullable: true })
  bookPrice?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  bookDesc?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  bookImages?: string[];

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  bookRent?: boolean;

  @IsOptional()
  @IsEnum(BookStatus)
  @Field(() => BookStatus, { nullable: true })
  bookStatus?: BookStatus;
}

// ========== SEARCH/FILTER ==========
@InputType()
export class BooksSearch {
  @IsOptional()
  @IsEnum(BookStatus)
  @Field(() => BookStatus, { nullable: true })
  bookStatus?: BookStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string; // Search in title or description

  @IsOptional()
  @Field(() => Float, { nullable: true })
  pricesRange?: number; // Max price filter

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  bookRent?: boolean;
}

// ========== GET BOOKS (LIST) ==========
@InputType()
export class BooksInput {
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

  @Field(() => BooksSearch)
  search: BooksSearch;
}

// ========== GET MY BOOKS ==========
@InputType()
export class MyBooksInput {
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @IsOptional()
  @IsEnum(BookStatus)
  @Field(() => BookStatus, { nullable: true })
  bookStatus?: BookStatus;
}