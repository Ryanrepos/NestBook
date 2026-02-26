import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { 
  IsNotEmpty, 
  IsOptional, 
  Min, 
  Max, 
  IsEnum, 
  IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';

// ========== CREATE ORDER (MULTIPLE BOOKS) ==========
@InputType()
export class OrderInput {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one book is required' })
  @ArrayMaxSize(20, { message: 'Maximum 20 books per order' })
  @IsMongoId({ each: true })
  @Field(() => [String])
  bookIds: string[];  // ← Changed to array
}

// ========== UPDATE ORDER STATUS ==========
@InputType()
export class OrderUpdate {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus)
  orderStatus: OrderStatus;
}

// ========== SEARCH/FILTER ==========
@InputType()
export class OrdersSearch {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;
}

// ========== GET ORDERS (LIST) ==========
@InputType()
export class OrdersInput {
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

  @Field(() => OrdersSearch)
  search: OrdersSearch;
}

// ========== MY ORDERS ==========
@InputType()
export class MyOrdersInput {
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;
}