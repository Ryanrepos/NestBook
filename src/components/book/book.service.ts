import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Book } from 'src/libs/dto/book/book';
import { BookInput } from 'src/libs/dto/book/book.input';
import { User } from 'src/libs/dto/user/user';
import { BookStatus } from 'src/libs/enums/book.enum';
import { Message } from 'src/libs/enums/common.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
        @InjectModel('Book') private readonly bookModel: Model<Book>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ){}

  public async createBook(input: BookInput, userId: ObjectId): Promise<Book> {
    this.logger.log(`Creating book: ${input.bookTitle} by user: ${userId}`);

    try {
      const createdBook = await this.bookModel.create({
        ...input,
        memberId: userId,  // ← Correct field name
        bookStatus: BookStatus.ACTIVE,
      });

      this.logger.log(`Book created successfully: ${createdBook._id}`);

      // Update user stats
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { userBooks: 1 }
      });

      return createdBook;
    } catch (err) {
      this.logger.error(`Create book error: ${err.message}`);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }
}
