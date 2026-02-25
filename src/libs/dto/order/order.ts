import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { OrderStatus, OrderType } from '../../enums/order.enum';
import { User } from '../user/user';
import { Book } from '../book/book';

@ObjectType()
export class Order {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

  @Field(() => Float)
  orderPrice: number;

  // Buyer ID
  @Field(() => String)
  buyerId: ObjectId;

  // Seller ID
  @Field(() => String)
  sellerId: ObjectId;

  // Book ID
  @Field(() => String)
  bookId: ObjectId;

  // Populated data (optional, for queries with joins)
  @Field(() => User, { nullable: true })
  buyerData?: User;

  @Field(() => User, { nullable: true })
  sellerData?: User;

  @Field(() => Book, { nullable: true })
  bookData?: Book;

  // Soft delete
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  // Timestamps
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Orders {
  @Field(() => [Order])
  list: Order[];

  @Field(() => Int)
  total: number;
}