import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import BookSchema from 'src/schemas/Book.model';
import userSchema from 'src/schemas/User.model';
import { AuthModule } from '../auth/auth.module';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';
import OrderSchema from 'src/schemas/Order.model';

@Module({
    imports: [MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'User', schema: userSchema },
      { name: 'Order', schema: OrderSchema}
    ]), 
      AuthModule, UserModule, BookModule
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService]
})
export class OrderModule {}
