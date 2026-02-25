import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guards';
import { Book, Books } from 'src/libs/dto/book/book';
import { BookInput, BooksInput, MyBooksInput } from 'src/libs/dto/book/book.input';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import * as mongoose from 'mongoose';

@Resolver()
export class BookResolver {
    constructor(private readonly bookService: BookService){}

  @UseGuards(AuthGuard)
  @Mutation(() => Book)
  public async createBook(
    @Args('input') input: BookInput,
    @AuthUser('_id') userId: mongoose.ObjectId): Promise<Book> {
    // Don't mutate input! Pass userId separately
    return await this.bookService.createBook(input, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Book)
  public async updateBook(@Args('bookId') bookId: string,
    @Args('input') input: BookInput, 
  @AuthUser('_id') userId: mongoose.ObjectId): Promise<Book> {
    return await this.bookService.updateBook(bookId, input, userId);
  }

  @Query(() => Book)
  public async getBook(@Args('bookId') bookId: string): Promise<Book> {
    return await this.bookService.getBook(bookId);
  }

  @Query(() => Books)
  public async getBooks(@Args('input') input: BooksInput): Promise<Books> {
    return await this.bookService.getBooks(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteBook(@Args('bookId') bookId: string, @AuthUser('_id') userId: mongoose.ObjectId): Promise<boolean> {
    return await this.bookService.deleteBook(bookId, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Books)
  public async getMyBooks(@Args('input') input: MyBooksInput,
    @AuthUser('_id') userId: mongoose.ObjectId): Promise<Books> {
      return await this.bookService.getMyBooks(input, userId);
    }

}
