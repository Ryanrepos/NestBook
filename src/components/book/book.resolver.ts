import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guards';
import { Book } from 'src/libs/dto/book/book';
import { BookInput } from 'src/libs/dto/book/book.input';
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
}
