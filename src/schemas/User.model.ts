import { Schema } from "mongoose";
import { UserAuthType, UserRole, UserStatus } from "src/libs/enums/user.enum";

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
        index: { unique: true, sparse: true },
        required: true,
    },
    userNick: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },
    userPassword: {
        type: String,
        select: false,
        required: true,
    },
},
    {timestamps: true, collection: 'users'}
);

export default userSchema;