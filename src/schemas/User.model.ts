import { Schema } from 'mongoose';
import { UserAuthType, UserRole, UserStatus } from '../libs/enums/user.enum';

const userSchema = new Schema(
  {
    userRole: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },

    userStatus: {
      type: String,
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },

    userAuthType: {
      type: String,
      enum: UserAuthType,
      default: UserAuthType.EMAIL,
    },

    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    userPassword: {
      type: String,
      required: true,
      select: false,
    },

    userFullName: {
      type: String,
      default: '',
    },

    userImage: {
      type: String,
      default: '/icons/default-user.svg',
    },

    userBio: {
      type: String,
      default: '',
    },

    // ========== STATISTICS ==========
    userBooks: {
      type: Number,
      default: 0,
    },

    userReviews: {
      type: Number,
      default: 0,
    },

    userFollowers: {
      type: Number,
      default: 0,
    },

    userFollowings: {
      type: Number,
      default: 0,
    },

    userLikes: {
      type: Number,
      default: 0,
    },

    userViews: {
      type: Number,
      default: 0,
    },

    // ========== SOFT DELETE ==========
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes
userSchema.index({ userEmail: 1 });

export default userSchema;