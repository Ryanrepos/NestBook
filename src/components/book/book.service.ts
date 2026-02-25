import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Book, Books } from 'src/libs/dto/book/book';
import { BookInput, BooksInput, MyBooksInput } from 'src/libs/dto/book/book.input';
import { User } from 'src/libs/dto/user/user';
import { BookStatus } from 'src/libs/enums/book.enum';
import { Direction, Message } from 'src/libs/enums/common.enum';
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

  public async updateBook(bookId: string, input: BookInput, userId: ObjectId): Promise<Book> {
    this.logger.log(`Updating book: ${bookId} by user: ${userId}`);

    const book = await this.bookModel.findById(bookId).exec();

    if (!book) throw new NotFoundException(Message.BOOK_NOT_FOUND);

    if (book.bookStatus === BookStatus.DELETE){
      throw new NotFoundException(Message.BOOK_NOT_FOUND);
    }

    // checking the book belongs to the user
    if (book.memberId.toString() !== userId.toString()) {
      throw new ForbiddenException(Message.NOT_FOLLOWED);
    }

    const updateBook = await this.bookModel.findByIdAndUpdate(
      bookId,
      { $set: input },
      { new: true }
    ).exec();

    if (!updateBook) {
    throw new NotFoundException(Message.UPDATE_FAILED);
    }

    return updateBook;
  }

  public async getBook(bookId: string): Promise<Book> {
    this.logger.log(`Getting book: ${bookId}`);

    const book = await this.bookModel.findById(bookId).exec();

    if(!book || book.bookStatus === BookStatus.DELETE) {
      throw new NotFoundException(Message.BOOK_NOT_FOUND);
    }

    return book;
  }

  public async getBooks(input: BooksInput): Promise<Books> {
  const { 
    page = 1, 
    limit = 10, 
    sort = 'createdAt',
    direction = Direction.DESC,
    search 
  } = input;

  this.logger.log(`Fetching books: page ${page}, limit ${limit}`);

  const match: any = {};

  if (search.bookStatus) {
    match.bookStatus = search.bookStatus;
  } else {
    match.bookStatus = { $ne: BookStatus.DELETE };  // Delete status dan tashqari
  }

  if (search.text) {
    match.$or = [
      { bookTitle: { $regex: new RegExp(search.text, 'i') } },
      { bookDesc: { $regex: new RegExp(search.text, 'i') } }
    ];
  }

  if (search.pricesRange) {
    match.bookPrice = { $lte: search.pricesRange };
  }

  if (search.bookRent !== undefined) {
    match.bookRent = search.bookRent;
  }

  const sortObject: any = { [sort]: direction };

  try {
    const result = await this.bookModel
      .aggregate([
        { $match: match },
        { $sort: sortObject },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit }
            ],
            metaCounter: [{ $count: 'total' }]
          }
        }
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const { list, metaCounter } = result[0];
    const total = metaCounter.length > 0 ? metaCounter[0].total : 0;

    this.logger.log(`Found ${list.length} books, total: ${total}`);

    return {
      list,
      total,
    };
  } catch (err) {
    this.logger.error(`Error fetching books: ${err.message}`);
    throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  }
}

public async deleteBook(bookId: string, userId: ObjectId): Promise<boolean> {
  this.logger.log(`Deleting book: ${bookId} by user: ${userId}`);
  
  const book = await this.bookModel.findById(bookId).exec();

  if (!book) {
    this.logger.warn(`Book not found: ${bookId}`);
    throw new NotFoundException(Message.BOOK_NOT_FOUND);
  }

  if (book.bookStatus === BookStatus.DELETE) {
    this.logger.warn(`Book already deleted: ${bookId}`);
    throw new NotFoundException(Message.BOOK_NOT_FOUND);
  }

  if (book.memberId.toString() !== userId.toString()) {
    this.logger.warn(`User ${userId} is not owner of book ${bookId}`);
    throw new ForbiddenException(Message.NOT_ALLOWED);
  }

  try {
    await this.bookModel.findByIdAndUpdate(
      bookId,
      {
        bookStatus: BookStatus.DELETE,
        deletedAt: new Date()
      }
    ).exec();

    await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { userBooks: -1 } }
    ).exec();

    this.logger.log(`Book deleted successfully: ${bookId}`);
    return true;
  } catch (err) {
    this.logger.error(`Delete book error: ${err.message}`);
    throw new InternalServerErrorException(Message.REMOVE_FAILED);
  }
}

public async getMyBooks(input: MyBooksInput, userId: ObjectId): Promise<Books> {
  const { 
    page = 1, 
    limit = 10, 
    bookStatus 
  } = input;

  this.logger.log(`Fetching my books: page ${page}, limit ${limit}, userId: ${userId}`);

  const match: any = {
    memberId: userId,  
  };

  if (bookStatus) {
    match.bookStatus = bookStatus;  
  } else {
    match.bookStatus = { $ne: BookStatus.DELETE };  
  }

  const sortObject: any = { createdAt: -1 };

  try {
    // Execute aggregation
    const result = await this.bookModel
      .aggregate([
        { $match: match },
        { $sort: sortObject },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit }
            ],
            metaCounter: [{ $count: 'total' }]
          }
        }
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const { list, metaCounter } = result[0];
    const total = metaCounter.length > 0 ? metaCounter[0].total : 0;

    this.logger.log(`Found ${list.length} books, total: ${total}`);

    return {
      list,
      total,
    };
  } catch (err) {
    this.logger.error(`Error fetching my books: ${err.message}`);
    throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  }
}

}
