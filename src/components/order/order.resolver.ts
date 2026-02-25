import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from 'src/libs/dto/order/order';
import { OrderInput } from 'src/libs/dto/order/order.input';
import type { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guards';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/authUser.decorator';

@Resolver()
export class OrderResolver {
    constructor(private readonly orderService: OrderService){}

    @Mutation(()=> Order)
    @UseGuards(AuthGuard)
    public async createOrder(@Args('input') input: OrderInput, 
    @AuthUser('_id') userId: ObjectId
    ): Promise<Order> {
        return await this.orderService.createOrder(input, userId)
    }
}
