import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/libs/dto/order/order';
import { AuthService } from '../auth/auth.service';
import { Model, ObjectId } from 'mongoose';
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

       const { bookId } = input;

       const book = await this.bookModel.findById(bookId).exec();

       if (!book) throw new NotFoundException(Message.BOOK_NOT_FOUND);

       if (book.bookStatus !== BookStatus.ACTIVE) {
        throw new BadRequestException("Book is not available for order");
       }

       if (book.memberId.toString() === userId.toString()) {
        throw new BadRequestException("Can not order your own book");
       }

       try {
            const createdOrder = await this.orderModel.create({
                buyerId: userId,
                sellerId: book.memberId,
                bookId: book._id,
                orderPrice: book.bookPrice,
                orderStatus: OrderStatus.PENDING,
            })
            return createdOrder;
       } catch(err) {
            throw new InternalServerErrorException(Message.CREATE_FAILED);
       }
    }
        
}
