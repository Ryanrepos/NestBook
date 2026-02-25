import { Schema } from 'mongoose';
import { BookStatus } from 'src/libs/enums/book.enum';

const BookSchema = new Schema(
  {
    bookStatus: {
      type: String,
      enum: BookStatus,
      default: BookStatus.ACTIVE,
    },

    bookTitle: {
      type: String,
      required: true,
      trim: true,
    },

    bookPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    bookViews: {
      type: Number,
      default: 0,
    },

    bookLikes: {
      type: Number,
      default: 0,
    },

    bookComments: {
      type: Number,
      default: 0,
    },

    bookRank: {
      type: Number,
      default: 0,
    },

    bookImages: {
      type: [String],
      default: [],
    },

    bookDesc: {
      type: String,
      default: '',
    },

    bookRent: {
      type: Boolean,
      default: false,
    },

    // Author reference
    memberId: {
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
    collection: 'books',
  }
);

// Indexes
BookSchema.index({ bookTitle: 1 });
BookSchema.index({ bookPrice: 1 });
BookSchema.index({ memberId: 1 });
BookSchema.index({ bookStatus: 1 });
BookSchema.index({ bookRank: -1 });
BookSchema.index({ createdAt: -1 });

export default BookSchema;