import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/libs/dto/order/order';
import { AuthService } from '../auth/auth.service';
import { Model, ObjectId, Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';
import { OrderInput } from 'src/libs/dto/order/order.input';
import { Book } from 'src/libs/dto/book/book';
import { User } from 'src/libs/dto/user/user';
import { Message } from 'src/libs/enums/common.enum';
import { BookStatus } from 'src/libs/enums/book.enum';
import { OrderStatus } from 'src/libs/enums/order.enum';

@Injectable()
export class OrderService {
constructor(
    @InjectModel('Book') private readonly bookModel: Model<Book>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly bookService: BookService,
) {}

public async createOrder(input: OrderInput, userId: ObjectId): Promise<Order> {
  const { bookIds } = input;

  // Step 1: Find all books
    const bookObjectIds = bookIds.map(id => new Types.ObjectId(id));
    const books = await this.bookModel.find({ _id: { $in: bookObjectIds } } as any).exec();
  // Step 2: Validate all books exist
  if (books.length !== bookIds.length) {
    throw new NotFoundException('One or more books not found');
  }

  // Step 3: Validate each book
  const sellerIds: ObjectId[] = [];
  const bookPrices: number[] = [];
  let totalPrice = 0;

  for (const book of books) {
    // Check book is available
    if (book.bookStatus !== BookStatus.ACTIVE) {
      throw new BadRequestException(`Book "${book.bookTitle}" is not available for purchase`);
    }

    // Prevent ordering own book
    if (book.memberId.toString() === userId.toString()) {
      throw new BadRequestException(`Cannot order your own book: "${book.bookTitle}"`);
    }

    // Collect seller IDs and prices
    sellerIds.push(book.memberId);
    bookPrices.push(book.bookPrice);
    totalPrice += book.bookPrice;
  }

  try {
    // Step 4: Create order with multiple books
    const createdOrder = await this.orderModel.create({
      buyerId: userId,
      sellerIds: sellerIds,
      bookIds: books.map(book => book._id),
      bookPrices: bookPrices,
      orderPrice: totalPrice,
      orderStatus: OrderStatus.PENDING,
    });

    return createdOrder;
  } catch (err) {
    throw new InternalServerErrorException(Message.CREATE_FAILED);
  }
}

 public async getOrder(orderId: string, userId: ObjectId): Promise<Order> {

  const order = await this.orderModel.findById(orderId).exec();

  if (!order) {
    throw new NotFoundException(Message.NO_DATA_FOUND);
  }

  if (order.deletedAt) {
    throw new NotFoundException(Message.NO_DATA_FOUND);
  }

  const isBuyer = order.buyerId.toString() === userId.toString();
  const isSeller = order.sellerIds.some(
    sellerId => sellerId.toString() === userId.toString()
  );

  if (!isBuyer && !isSeller) {
    throw new ForbiddenException(Message.NOT_ALLOWED);
  }

  return order; 
}

        
}
