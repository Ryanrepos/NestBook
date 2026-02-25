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

    // Book being ordered
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },

    // Seller (book owner)
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

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
OrderSchema.index({ sellerId: 1 });
OrderSchema.index({ bookId: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export default OrderSchema;