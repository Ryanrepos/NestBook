import { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';

const OrderSchema = new Schema(
  {
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },

    orderPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Buyer (who is ordering)
    buyerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Books being ordered (CHANGED TO ARRAY)
    bookIds: [{  // ← Changed from bookId to bookIds (array)
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    }],

    // Sellers (book owners) - ARRAY since multiple books can have different owners
    sellerIds: [{  // ← Changed from sellerId to sellerIds (array)
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }],

    // Individual book prices (to track price at time of order)
    bookPrices: [{  // ← New field: price of each book
      type: Number,
      required: true,
    }],

    // Soft delete
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

// Indexes
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ 'sellerIds': 1 });
OrderSchema.index({ 'bookIds': 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export default OrderSchema;