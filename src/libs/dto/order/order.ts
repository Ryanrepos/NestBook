import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';
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

  // Seller IDs (array)
  @Field(() => [String])
  sellerIds: ObjectId[];

  // Book IDs (array)
  @Field(() => [String])
  bookIds: ObjectId[];

  // Book prices (array)
  @Field(() => [Float])
  bookPrices: number[];

  // Populated data (optional, for queries with joins)
  @Field(() => User, { nullable: true })
  buyerData?: User;

  @Field(() => [User], { nullable: true })
  sellerData?: User[];  // Array of sellers

  @Field(() => [Book], { nullable: true })
  bookData?: Book[];  // Array of books

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